import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { User } from '@/common/decorators/request-user.decorator';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RefreshTokenInput,
  SignUpInput,
  UpdateForgotPasswordInput,
} from '@/common/dtos/auth.dto';
import { authGuardian } from '@/common/guards/authentication/auth.guard';
import { AuthenticatedModel } from '@/common/models/auth.model';
import { AuthService } from '@/services/auth.service';

@Resolver(AuthenticatedModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthenticatedModel)
  async signUp(@Args('data') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthenticatedModel)
  async login(@Args('data') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(authGuardian())
  async logout(@User('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Mutation(() => AuthenticatedModel)
  async refreshToken(@Args('data') refreshToken: RefreshTokenInput) {
    return this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(authGuardian())
  async changePassword(@Args('data') data: ChangePasswordInput, @User('id') userId: string) {
    return this.authService.changePassword(data, userId);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('data') data: ForgotPasswordInput) {
    return this.authService.forgotPassword(data.email);
  }

  @Mutation(() => Boolean)
  async updateForgotPassword(@Args('data') data: UpdateForgotPasswordInput) {
    return this.authService.updateForgotPassword(data);
  }
}
