import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';

import { LocalStorageService } from '@/config/cls/cls.config';

export function ClassValidatorErrorParserUtil(
  validationErrors: any,
  configService: ConfigService,
  localStorageService: LocalStorageService
): GraphQLFormattedError {
  const showStacktrace = JSON.parse(configService.getOrThrow('SHOW_STACK_TRACE'));
  const messages = validationErrors.extensions.originalError.message as string[];
  const message = messages.join(', ');

  return {
    message,
    path: validationErrors.path,
    extensions: {
      stacktrace: showStacktrace ? validationErrors.extensions.stacktrace : undefined,
      requestId: localStorageService.getId(),
      code: HttpStatus.BAD_REQUEST,
      http: {
        status: HttpStatus.BAD_REQUEST,
      },
    },
  };
}
