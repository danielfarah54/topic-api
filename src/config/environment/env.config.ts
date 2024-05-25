import * as fs from 'fs';
import * as path from 'path';

import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentVariables } from '@/config/environment/env';

/**
 * Opções de configuração para o módulo de configuração (ConfigModule) do NestJS.
 */
export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: getEnvFilePath(), // Caminho do arquivo de configuração do ambiente
  expandVariables: true, // Expande variáveis de ambiente no formato $VAR ou ${VAR}
  validate, // Função de validação das configurações
  cache: true, // Habilita o cache das configurações
  isGlobal: true, // Torna as configurações globais para toda a aplicação
};

/**
 * Função para validar as configurações usando decorators de classe e validadores do class-validator.
 * @param config Objeto de configuração
 * @returns {EnvironmentVariables} configurações validadas
 * @throws Error erro é lançado se houver problemas de validação nas configurações.
 */
function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(validatedConfig, { skipMissingProperties: false, whitelist: true });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

/**
 * Obtém o caminho do arquivo de configuração do ambiente.
 * @returns {string} caminho do arquivo de configuração
 * @throws Error erro é lançado se o arquivo de configuração do ambiente não for encontrado.
 */
export function getEnvFilePath(): string {
  const environment = process.env.NODE_ENV;

  if (!environment) throw new Error('Ambiente não definido');

  const customEnvFilePath = path.join(process.cwd(), 'env', `.env.${environment}`);
  const defaultEnvFilePath = path.join(process.cwd(), '.env');

  if (fs.existsSync(customEnvFilePath)) return customEnvFilePath;
  if (fs.existsSync(defaultEnvFilePath)) return defaultEnvFilePath;

  throw new Error('Arquivo de configuração do ambiente não encontrado');
}
