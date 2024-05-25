import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsLowercase, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

import { ToLowerCase } from '../utils/functions/case-transform.util';

@InputType('SignUpInput')
export class SignUpInput {
  @MinLength(2)
  @MaxLength(180)
  @IsString()
  @IsNotEmpty()
  @Field()
  name: string;

  @MinLength(2)
  @MaxLength(180)
  @ToLowerCase()
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  @IsNotEmpty()
  @Field()
  password: string;
}

@InputType('LoginInput')
export class LoginInput {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  password: string;
}

@InputType('RefreshTokenInput')
export class RefreshTokenInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  refreshToken: string;
}

@InputType('ChangePasswordInput')
export class ChangePasswordInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  oldPassword: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  @IsNotEmpty()
  @Field()
  newPassword: string;
}

@InputType('ForgotPasswordInput')
export class ForgotPasswordInput {
  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  @Field()
  email: string;
}

@InputType('UpdateForgotPasswordInput')
export class UpdateForgotPasswordInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  code: string;

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  @MaxLength(10)
  @IsNotEmpty()
  @Field()
  password: string;
}
