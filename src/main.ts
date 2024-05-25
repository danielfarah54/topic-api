import http from 'http';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from '@/app.module';
import { Environment } from '@/common/enums/env.enum';
import { RequestExceptionFilter } from '@/common/filters/request-exception.filter';
import { I18nService } from '@/common/services/i18n.service';
import { classValidatorSetup } from '@/config/class-validator/class-validator';
import { LocalStorageService } from '@/config/cls/cls.config';
import { prismaSetup } from '@/config/database/prisma/prisma.config';
import { GraphQLService } from '@/config/graphql/graphql.service';
import { ShutdownObserver } from '@/config/server/shutdown-observer';

/**
 * Função principal para inicializar a aplicação.
 * Cria a instância da aplicação NestJS, configura filtros, CORS,
 * realiza configurações de validação de classes, conexão com o banco de dados,
 * configuração do Swagger e inicia o servidor.
 */
async function bootstrap() {
  // Create the NestJS application
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const graphqlService = app.get(GraphQLService);
  const configService = app.get(ConfigService);
  const localStorageService = app.get(LocalStorageService);
  const i18nService = app.get(I18nService);
  const shutdownObserver = app.get(ShutdownObserver);
  const environment = configService.getOrThrow('NODE_ENV');
  const port = configService.getOrThrow('PORT');
  const graphqlUrl = configService.get('GRAPHQL_URL');

  // Configuração de Filtros Globais
  app.useGlobalFilters(new RequestExceptionFilter(localStorageService, i18nService));

  // Configuração do CORS (Cross-Origin Resource Sharing)
  app.enableCors({ allowedHeaders: '*', origin: '*', methods: '*' });

  // Configuração adicional
  classValidatorSetup(app);
  await prismaSetup(app);
  await app.init();

  // Criando instância do servidor
  const expressServer = http.createServer(server); //getExpressServer(environment, server);
  const apolloServer = new ApolloServer({
    typeDefs: graphqlService.getSchema(),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: expressServer })],
  });

  // Inicialização do servidor
  await apolloServer.start();
  expressServer.listen(port);
  shutdownObserver.addHttpServer(expressServer);

  if (environment !== Environment.PRD) {
    // Exibição de informações de desenvolvimento apenas para ambientes diferentes de PRD
    const logger = new Logger('Bootstrap');
    const host = `http://localhost:${port}`;

    logger.log(`Application is running at: ${host} 🔥`);
    logger.log(`Graphql playground at: ${host}/${graphqlUrl} 📚`);
  }
}

bootstrap();
