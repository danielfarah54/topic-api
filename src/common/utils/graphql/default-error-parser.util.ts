import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';

import { LocalStorageService } from '@/config/cls/cls.config';

export function DefaultErrorParserUtil(
  error: any,
  configService: ConfigService,
  localStorageService: LocalStorageService
): GraphQLFormattedError {
  const showStacktrace = JSON.parse(configService.getOrThrow('SHOW_STACK_TRACE'));

  return {
    message: error.message,
    path: error.path,
    extensions: {
      requestId: localStorageService.getId(),
      cause: error.extensions?.cause,
      description: error.extensions?.description,
      stacktrace: showStacktrace ? [...error.extensions.stacktrace, error.extensions.tracePath] : undefined,
      code: error.extensions?.code || HttpStatus.BAD_REQUEST,
      http: {
        status: error.extensions?.code || HttpStatus.BAD_REQUEST,
      },
    },
  };
}
