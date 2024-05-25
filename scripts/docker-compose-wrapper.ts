import { spawnSync } from 'child_process';
import { error } from 'console';

/**
 * Docker Compose Wrapper Script
 * Este script é um utilitário para checar se está utilizando a v2 do compose ou a v1 e redirecionar para o comando correto.
 */

function isDockerComposeAvailable(): Array<string> | boolean {
  try {
    spawnSync('docker', ['compose', '--version']);
    return ['compose'];
  } catch {
    return false;
  }
}

function isDockerComposeExecutable(): string | false {
  try {
    spawnSync('docker-compose', ['--version']);
    return 'docker-compose';
  } catch {
    return false;
  }
}

function runDockerComposeCommand(exec: string, args: string[]): void {
  process.env.COMPOSE_IGNORE_ORPHANS = 'True';
  const childProcess = spawnSync(exec, args, { stdio: 'inherit' });
  process.exit(childProcess.status || 0);
}

const compose = isDockerComposeAvailable() || isDockerComposeExecutable();

if (typeof compose === 'string') {
  runDockerComposeCommand(compose, process.argv.slice(2));
} else if (typeof compose === 'object') {
  runDockerComposeCommand('docker', [...compose, ...process.argv.slice(2)]);
} else {
  error('docker-compose ou docker compose não encontrado');
  process.exit(1);
}
