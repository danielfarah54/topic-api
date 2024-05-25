import { HttpExceptionOptions } from '@nestjs/common';

/**
 * Exceção personalizada para erros de solicitação HTTP.
 * Foi criada para poder traduzir as mensagens de erro sem precisar sobrescrever o erro HTTP padrão do NestJS.
 */
export class RequestException {
  readonly cause: unknown;
  readonly description: string;
  readonly message: string;
  readonly code: number;
  readonly tracePath: string;

  /**
   * Cria uma nova instância da exceção de solicitação.
   * @param message mensagem da exceção.
   * @param code Código HTTP
   * @param options Opções adicionais para a exceção.
   */
  constructor(message: string, code: number, options: HttpExceptionOptions = {}) {
    // Define as propriedades da exceção
    this.tracePath = new Error().stack?.split('\n')[2] || 'Unknown';
    this.message = message;
    this.cause = options.cause;
    this.description = options.description;
    this.code = code;
  }
}
