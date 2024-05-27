import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthenticationMethod } from '@/common/enums/env.enum';
import { RequestException } from '@/common/exceptions/request-exception.exception';
import { getGqlExecutionContext } from '@/common/utils/graphql/execution-context.util';

class AuthGuardian extends AuthGuard([AuthenticationMethod.JWT]) {
  /**
   * Altera o contexto da solicitação para o contexto do GraphQL.
   * @param context Contexto da request.
   */
  getRequest(context: ExecutionContext): any {
    return getGqlExecutionContext(context).req;
  }

  /**
   * Manipula a solicitação durante a validação do guardião.
   * @param err Erro ocorrido durante a validação.
   * @param user Usuário autenticado.
   * @param info Informações adicionais.
   * @returns {User} dados do usuário autenticado ou lança uma exceção em caso de erros.
   */
  handleRequest(err: any, user: any, info: any): any {
    // Verifica se há informações de expiração do token
    if (info) {
      if (info.name === 'TokenExpiredError') {
        throw new RequestException('TokenExpired', HttpStatus.UNAUTHORIZED);
      }
    }

    // Verifica se ocorreu algum erro ou se o usuário não está autenticado
    if (err || !user) {
      throw new RequestException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}

/**
 * Guardião de autenticação personalizado para validar usuários.
 */

export function authGuardian(): typeof AuthGuardian {
  return AuthGuardian;
}
