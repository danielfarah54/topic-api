import { execSync } from 'child_process';
import { log } from 'console';
import * as path from 'path';
import * as readline from 'readline';

import { Command } from 'commander';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { prompt } from 'enquirer';

import { Environment } from '@/common/enums/env.enum';

const environments = Object.values(Environment);
const defaultEnvironment = Environment.LOC;
const program = new Command();

let selectedEnvironment: Environment;

process.on('SIGINT', () => process.exit());

/**
 * Este script é responsável por carregar as variáveis de ambiente de acordo com o ambiente selecionado.
 * É um utilitário para facilitar o desenvolvimento, deploy e testes.
 * Não deve ser usado em produção.
 */

// Prompt interativo para selecionar o ambiente
async function selectEnvironment() {
  let timeout = 5;
  let timeoutId;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  process.on('SIGINT', () => {
    clearInterval(timeoutId);
    rl.close();
    process.exit();
  });

  const response: any = await Promise.race([
    prompt({
      type: 'select',
      name: 'environment',
      message: `Selecione um ambiente !\n O ambiente padrão '${defaultEnvironment}' será selecionado em ${timeout} segundos :)`,
      choices: environments,
    }),
    new Promise((resolve) => {
      timeoutId = setInterval(() => {
        timeout--;
        if (timeout <= 0) {
          clearInterval(timeoutId);
          resolve({ environment: defaultEnvironment });
        }
      }, 1000);
    }),
  ]);

  clearInterval(timeoutId);
  rl.close();

  selectedEnvironment = response.environment;
  log(`Ambiente ${selectedEnvironment} selecionado!`);
}

// Carrega as variáveis de ambiente do arquivo .env.<environment> e executa o comando passado
function configureEnvironment() {
  const envPath = path.join(process.cwd(), `./env/.env.${selectedEnvironment}`);
  const args = process.argv.slice(2);

  expand(config({ path: envPath }));
  process.env.NODE_ENV = selectedEnvironment;

  if (args.length > 0) {
    try {
      execSync(args.join(' '), { stdio: 'inherit' });
      process.exit(1);
    } catch (e) {
      process.exit(1);
    }
  }
}

// Remove argumentos passados para o cli (ex: -e, --environment, -d, --default, -l, --list)
function removeCommandAndOptionsFromArgv(commandName?: string, optionsToRemove?: string[]): void {
  const commandIndex = process.argv.indexOf(commandName);
  if (commandIndex !== -1) {
    process.argv.splice(commandIndex, 1); // Remove the command
  }

  if (optionsToRemove) {
    optionsToRemove.forEach((option) => {
      const optionIndex = process.argv.indexOf(option);
      if (optionIndex !== -1) {
        process.argv.splice(optionIndex, 1);
      }
    });
  }
}

// Configura e executa a cli de seleção do ambiente
program
  .allowUnknownOption()
  .option('-e, --environment <environment>', 'Seleciona o ambiente')
  .option('-d, --default', 'Seleciona o ambiente padrão')
  .option('-l, --list', 'Lista os ambientes disponíveis')
  .action(async (args: any) => {
    if (args.default) {
      log(`Usando o ambiente padrão: ${defaultEnvironment}...`);
      selectedEnvironment = defaultEnvironment;
      removeCommandAndOptionsFromArgv(undefined, ['-d', '--default']);
    }
    if (args.list) {
      await selectEnvironment();
      removeCommandAndOptionsFromArgv(undefined, ['-l', '--list']);
    }
    if (args.environment) {
      selectedEnvironment = args.environment;
      removeCommandAndOptionsFromArgv(undefined, ['-e', '--environment', selectedEnvironment]);
    }

    configureEnvironment();
  });

program.parse(process.argv);
