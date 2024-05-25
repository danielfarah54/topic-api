import { Catch, ExceptionFilter } from '@nestjs/common';
import { GraphQLError } from 'graphql/error';

import { RequestException } from '@/common/exceptions/request-exception.exception';
import { I18nService } from '@/common/services/i18n.service';
import { LocalStorageService } from '@/config/cls/cls.config';

/**
 * Filtro de exceção para capturar e manipular a exceção personalizada RequestException.
 */
@Catch(RequestException)
export class RequestExceptionFilter implements ExceptionFilter {
  constructor(private readonly localStorageService: LocalStorageService, private readonly i18nService: I18nService) {}

  /**
   * Captura e manipula a exceção RequestException.
   * @param exception Exceção capturada.
   */
  async catch(exception: RequestException) {
    const message = await this.i18nService.translateException(exception.message); // Traduz a mensagem da exceção

    throw new GraphQLError(message, {
      extensions: {
        code: exception.code,
        requestId: this.localStorageService.getId(), // Obtém o ID da solicitação a partir do serviço LocalStorage
        tracePath: exception.tracePath,
        ...(exception.description ? { description: exception.description } : {}), // Adiciona a descrição, se houver
        ...(exception.cause ? { cause: exception.cause } : {}), // Adiciona a causa, se houver
        http: {
          status: exception.code,
        },
      },
    });
  }
}
