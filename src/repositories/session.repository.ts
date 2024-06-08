import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';

import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private prismaService: PrismaService) {}

  create(userId: string, data: Omit<Prisma.SessionCreateInput, 'user'>): Promise<Session> {
    return this.prismaService.session.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  findByUserId(userId: string): Promise<Session> {
    return this.prismaService.session.findFirst({ where: { userId } });
  }

  update(userId: string, data: Pick<Prisma.SessionUpdateInput, 'token' | 'refresh'>): Promise<Session> {
    return this.prismaService.session.update({
      where: { userId },
      data,
    });
  }

  async hardDelete(userId: string): Promise<void> {
    await this.prismaService.session.delete({ where: { userId } });
  }
}
