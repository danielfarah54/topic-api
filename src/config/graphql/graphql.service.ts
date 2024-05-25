import { Injectable } from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { GraphQLSchema } from 'graphql/type';

@Injectable()
export class GraphQLService {
  constructor(private readonly schemaHost: GraphQLSchemaHost) {}

  getSchema(): GraphQLSchema {
    return this.schemaHost.schema;
  }
}
