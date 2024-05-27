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
  signUp(@Args('data') signUpInput: SignUpInput): Promise<AuthenticatedModel> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthenticatedModel)
  login(@Args('data') loginInput: LoginInput): Promise<AuthenticatedModel> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(authGuardian())
  logout(@User('id') userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Mutation(() => AuthenticatedModel)
  refreshToken(@Args('data') refreshToken: RefreshTokenInput): Promise<AuthenticatedModel> {
    return this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(authGuardian())
  changePassword(@Args('data') data: ChangePasswordInput, @User('id') userId: string): Promise<boolean> {
    return this.authService.changePassword(data, userId);
  }

  @Mutation(() => Boolean)
  forgotPassword(@Args('data') data: ForgotPasswordInput): Promise<boolean> {
    return this.authService.forgotPassword(data.email);
  }

  @Mutation(() => Boolean)
  updateForgotPassword(@Args('data') data: UpdateForgotPasswordInput): Promise<boolean> {
    return this.authService.updateForgotPassword(data);
  }
}
