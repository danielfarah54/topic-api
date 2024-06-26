import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Habilita os hooks de shutdown para fechar a conexão com o banco de dados.
   * @param app
   */
  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Inicializa a conexão com o banco de dados.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
