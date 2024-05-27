import { INestApplication, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

/**
 * Configuração global para validação de classes usando decorators.
 * @param app Instância da aplicação NestJS.
 */
export const classValidatorSetup = (app: INestApplication): void => {
  // Opções para a configuração da validação de classes
  const options: ValidationPipeOptions = {
    whitelist: true, // Habilita apenas as propriedades decoradas a serem validadas
    forbidNonWhitelisted: true, // Impede a validação de propriedades não decoradas
    validateCustomDecorators: true, // Valida também decorators personalizados
  };

  // Aplica a validação de classes globalmente à aplicação
  app.useGlobalPipes(new ValidationPipe(options));
};
