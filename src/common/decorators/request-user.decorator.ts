import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { getGqlExecutionContext } from '@/common/utils/graphql/execution-context.util';

/**
 * Decorador de parâmetro personalizado para obter informações do usuário a partir do contexto da solicitação.
 * @param field Campo opcional para obter um campo específico das informações do usuário.
 * @param context Contexto de execução da solicitação.
 * @returns {User} Informações do usuário ou campo específico das informações do usuário, se fornecido.
 */
export const User = createParamDecorator((field: string | undefined = undefined, context: ExecutionContext) => {
  // Obtém a requisição do contexto
  const request = getGqlExecutionContext(context).req;

  // Obtém as informações do usuário da requisição
  const user = request.user;

  // Se um campo específico for fornecido, retorna esse campo das informações do usuário
  if (field) return (user as Record<string, any>)[field];

  // Caso contrário, retorna todas as informações do usuário
  return user;
});
