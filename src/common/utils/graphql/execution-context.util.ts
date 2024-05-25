import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Obtém o contexto do GraphQL a partir do contexto da solicitação.
 * @param context Contexto da solicitação.
 */
export const getGqlExecutionContext = (context: ExecutionContext) => {
  return GqlExecutionContext.create(context).getContext();
};
