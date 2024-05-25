import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class UserPasswordResetRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UserPasswordResetUncheckedCreateInput) {
    return this.prismaService.userPasswordReset.create({ data });
  }

  async getByCode(code: string) {
    return this.prismaService.userPasswordReset.findFirst({ where: { code } });
  }

  async hardDeleteManyByUserId(userId: string) {
    return this.prismaService.userPasswordReset.deleteMany({ where: { userId } });
  }

  async hardDeleteByCode(code: string) {
    return this.prismaService.userPasswordReset.delete({ where: { code } });
  }
}
