import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import {
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  SignUpInput,
  UpdateForgotPasswordInput,
} from '@/common/dtos/auth.dto';
import { RequestException } from '@/common/exceptions/request-exception.exception';
import { IJwtPayload } from '@/common/interfaces/auth.interface';
import { AuthenticatedModel } from '@/common/models/auth.model';
import { BcryptService } from '@/common/services/bcrypt.service';
import { RollbackManager } from '@/common/utils/functions/rollback.util';
import { UserRepository } from '@/repositories/user.repository';
import { SessionService } from '@/services/session.service';
import { UserPasswordResetService } from '@/services/user-password-reset.service';
import { UserService } from '@/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bcryptService: BcryptService,
    private readonly sessionService: SessionService,
    private readonly userPasswordResetService: UserPasswordResetService,
    private readonly userService: UserService
  ) {}

  async signUp(data: SignUpInput): Promise<AuthenticatedModel> {
    const user = await this.userService.create(data);

    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.email,
    });

    await this.sessionService.save({ token: tokens.accessToken, refresh: tokens.refreshToken }, user.id);

    return { ...tokens };
  }

  async login({ email, password }: LoginInput): Promise<AuthenticatedModel> {
    const user = await this.validateUserPassword(email, password);

    if (!user) {
      throw new RequestException('InvalidCredentials', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      username: user.email,
    });

    await this.sessionService.save({ token: tokens.accessToken, refresh: tokens.refreshToken }, user.id);

    return { ...tokens };
  }

  logout(userId: string): Promise<boolean> {
    return this.sessionService.invalidate(userId);
  }

  async refreshToken({ refreshToken }: RefreshTokenInput): Promise<AuthenticatedModel> {
    let payload: IJwtPayload;

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (e: any) {
      if (e.name === 'TokenExpiredError') {
        throw new RequestException('TokenExpired', HttpStatus.UNAUTHORIZED);
      }

      throw new RequestException('NotAuthorized', HttpStatus.BAD_REQUEST);
    }

    const payloadUser = await this.userRepository.getById(payload!.sub);

    if (!payloadUser) {
      throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.generateTokens({
      sub: payloadUser.id,
      username: payloadUser.email,
    });

    await this.sessionService.save({ token: tokens.accessToken, refresh: tokens.refreshToken }, payloadUser.id);

    return { ...tokens };
  }

  async changePassword(data: ChangePasswordInput, userId: string): Promise<boolean> {
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.update(userId, {
      password: await this.bcryptService.hash(data.newPassword),
    });

    return true;
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);
    }

    await this.userPasswordResetService.hardDeleteManyByUserId(user.id);

    await this.userPasswordResetService.create(user.id);

    return true;
  }

  async updateForgotPassword(data: UpdateForgotPasswordInput): Promise<boolean> {
    const { code, password } = data;
    const userPasswordReset = await this.userPasswordResetService.getByCode(code);
    const user = await this.userRepository.getById(userPasswordReset.userId);
    const rollbackManager = new RollbackManager();

    await rollbackManager.step({
      forward: async () => {
        await this.userRepository.update(userPasswordReset.userId, {
          password: await this.bcryptService.hash(password),
        });
      },
      backward: async () => {
        await this.userRepository.update(userPasswordReset.userId, {
          password: user.password,
        });
      },
    });

    await rollbackManager.step({
      forward: async () => {
        await this.userPasswordResetService.hardDeleteByCode(code);
      },
    });

    return true;
  }

  private async generateTokens(payload: Partial<IJwtPayload>): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    return { accessToken, refreshToken };
  }

  private async validateUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getByEmail(email);

    if (user && (await this.bcryptService.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}
