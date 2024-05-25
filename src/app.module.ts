import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';

import { I18nMiddleware } from '@/common/middlewares/i18n.middleware';
import { LocalStorageMiddleware } from '@/common/middlewares/local-storage.middleware';
import { ComplexityPlugin } from '@/common/plugins/complexity.plugin';
import { I18nService } from '@/common/services/i18n.service';
import { PrismaService } from '@/common/services/prisma.service';
import { LocalStorageModule, LocalStorageService } from '@/config/cls/cls.config';
import { configModuleOptions } from '@/config/environment/env.config';
import { graphqlConfigFactory } from '@/config/graphql/graphql.config';
import { GraphQLService } from '@/config/graphql/graphql.service';
import { ShutdownObserver } from '@/config/server/shutdown-observer';
import { AuthModule } from '@/modules/auth.module';
import { SessionModule } from '@/modules/session.module';
import { UserModule } from '@/modules/user.module';

/**
 * Módulo raiz da aplicação.
 * Configura os módulos importados, provedores e funcionalidades globais.
 */
@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(configModuleOptions),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      /**
       * Configuração global do módulo GraphQL.
       */
      inject: [ConfigService, LocalStorageService],
      useFactory: graphqlConfigFactory,
      driver: ApolloDriver,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRATION_TIME') },
      }),
      global: true,
    }),
    LocalStorageModule,
    SessionModule,
    UserModule,
  ],
  providers: [ComplexityPlugin, GraphQLService, I18nService, PrismaService, ShutdownObserver],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  /**
   * Configuração de middlewares globais para todas as rotas.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LocalStorageMiddleware).forRoutes('*');
    consumer.apply(I18nMiddleware).forRoutes('*');
  }
}
