import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private readonly gqlSchemaHost: GraphQLSchemaHost, private readonly configService: ConfigService) {}

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const maxDepth = this.configService.getOrThrow('QUERY_MAX_DEPTH');
    const maxComplexity = maxDepth * 50 + 25;
    const { schema } = this.gqlSchemaHost;

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
        });
        if (complexity > maxComplexity) {
          // Erro sem tratamento ainda, pois o RequestException não está funcionando aqui por algum motivo
          throw new GraphQLError(`Query is too deep: ${maxDepth}. Maximum allowed depth: ${maxDepth}`);
        }
      },
    };
  }
}
