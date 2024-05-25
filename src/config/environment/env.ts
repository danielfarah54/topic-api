import { IsBooleanString, IsEnum, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

import { Environment } from '@/common/enums/env.enum';

/**
 * Classe que representa as variáveis de ambiente do sistema.
 * Seu objetivo é validar os valores das variáveis de ambiente.
 */
export class EnvironmentVariables {
  // Authentication variables
  @IsNumberString()
  @IsNotEmpty()
  BCRYPT_SALT_ROUNDS: number;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNumberString()
  @IsNotEmpty()
  QUERY_MAX_DEPTH: number;

  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV: string;

  @IsNumberString()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  MYSQL_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_USER: string;

  @IsString()
  @IsNotEmpty()
  MYSQL_HOST: number;

  @IsNumberString()
  @IsNotEmpty()
  MYSQL_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  GRAPHQL_URL: string;

  @IsBooleanString()
  @IsNotEmpty()
  SHOW_STACK_TRACE: boolean;

  @IsString()
  @IsNotEmpty()
  FORGOT_PASSWORD_CODE_EXPIRATION_MINUTES: string;
}
