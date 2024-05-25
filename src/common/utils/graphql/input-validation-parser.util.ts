import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';

import { LocalStorageService } from '@/config/cls/cls.config';

export function InputValidationParserUtil(
  validationErrors: any,
  configService: ConfigService,
  localStorageService: LocalStorageService
): GraphQLFormattedError {
  const showStacktrace = JSON.parse(configService.getOrThrow('SHOW_STACK_TRACE'));
  const message = Object.entries(validationErrors).reduce((prev, entry) => {
    const [key, value] = entry;
    if (key === 'message') return prev + value;
    return prev;
  }, '');

  const regex = /"([^"]+)\.([^"]+)"[^"]+"([^"]+)"/g;

  // Use replace method to transform the error message
  const cleanedErrorMessage = message.replace(regex, '"$2" of required type "$3"').replace(/"([^"]+)"/g, '$1');

  return {
    message: cleanedErrorMessage,
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
