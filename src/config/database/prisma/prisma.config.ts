import { INestApplication } from '@nestjs/common';

import { PrismaService } from '@/common/services/prisma.service';

/**
 * Configuração do Prisma para a aplicação.
 * Habilita ganchos de encerramento e soft delete no Prisma.
 * @param app Instância da aplicação NestJS.
 */
export const prismaSetup = (app: INestApplication): void => {
  // Obtém o serviço do Prisma da instância da aplicação
  const prismaService = app.get(PrismaService);

  // Habilita ganchos de encerramento para o Prisma
  prismaService.enableShutdownHooks(app);
};
