import { ConfigService } from '@nestjs/config';

import { Environment } from '@/common/enums/env.enum';
import { ClassValidatorErrorParserUtil } from '@/common/utils/graphql/class-validator-parser.util';
import { DefaultErrorParserUtil } from '@/common/utils/graphql/default-error-parser.util';
import { InputValidationParserUtil } from '@/common/utils/graphql/input-validation-parser.util';
import { LocalStorageService } from '@/config/cls/cls.config';

/**
 * Configuração global do módulo GraphQL.
 */
export const graphqlConfigFactory = (configService: ConfigService, localStorageService: LocalStorageService) => {
  const environment = configService.getOrThrow('NODE_ENV');
  return {
    autoSchemaFile: true, // Gera o schema automaticamente
    playground: environment !== Environment.PRD, // Habilita o playground apenas para ambientes diferentes de PRD
    status400ForVariableCoercionErrors: true,
    formatError: (error: any) => formatGraphqlErrors(error, configService, localStorageService),
    path: configService.getOrThrow('GRAPHQL_URL'),
    context: ({ req, res }) => ({ req, res }),
  };
};

const formatGraphqlErrors = (
  error: any,
  configService: ConfigService,
  localStorageService: LocalStorageService
): any => {
  const errorCode = error.extensions?.code;
  const stacktrace = error.extensions?.stacktrace as Array<string>;

  if (errorCode === 'GRAPHQL_VALIDATION_FAILED') {
    return InputValidationParserUtil(error, configService, localStorageService);
  }
  if (stacktrace.join(' ').includes('ValidationPipe')) {
    return ClassValidatorErrorParserUtil(error, configService, localStorageService);
  }

  return DefaultErrorParserUtil(error, configService, localStorageService);
};
