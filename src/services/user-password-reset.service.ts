import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserPasswordReset } from '@prisma/client';
import { isAfter } from 'date-fns';
import { v4 } from 'uuid';

import { RequestException } from '@/common/exceptions/request-exception.exception';
import { UserPasswordResetRepository } from '@/repositories/user-password-reset.repository';
import { UserService } from '@/services/user.service';

@Injectable()
export class UserPasswordResetService {
  constructor(
    private readonly userPasswordResetRepository: UserPasswordResetRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async create(userId: string): Promise<string> {
    const user = await this.userService.getById(userId);
    if (!user) throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);

    const code = v4();
    const expiresIn = this.configService.getOrThrow('FORGOT_PASSWORD_CODE_EXPIRATION_MINUTES');
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.getTime() + expiresIn * 60000);

    await this.userPasswordResetRepository.create({ userId, code, expiresAt });

    return code;
  }

  async hardDeleteManyByUserId(userId: string): Promise<void> {
    await this.userPasswordResetRepository.hardDeleteManyByUserId(userId);
  }

  async getByCode(code: string): Promise<UserPasswordReset> {
    const userPasswordReset = await this.userPasswordResetRepository.getByCode(code);

    if (!userPasswordReset) {
      throw new RequestException('ResourceNotFound', HttpStatus.BAD_REQUEST);
    }

    if (isAfter(new Date(), userPasswordReset.expiresAt)) {
      await this.userPasswordResetRepository.hardDeleteByCode(code);
      throw new RequestException('PasswordResetCodeExpired', HttpStatus.UNAUTHORIZED);
    }

    return userPasswordReset;
  }

  async hardDeleteByCode(code: string): Promise<void> {
    await this.userPasswordResetRepository.hardDeleteByCode(code);
  }
}
