import { Injectable } from '@nestjs/common';
import { Prisma, UserPasswordReset } from '@prisma/client';

import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class UserPasswordResetRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.UserPasswordResetUncheckedCreateInput): Promise<UserPasswordReset> {
    return this.prismaService.userPasswordReset.create({ data });
  }

  getByCode(code: string): Promise<UserPasswordReset> {
    return this.prismaService.userPasswordReset.findFirst({ where: { code } });
  }

  async hardDeleteManyByUserId(userId: string): Promise<void> {
    await this.prismaService.userPasswordReset.deleteMany({ where: { userId } });
  }

  async hardDeleteByCode(code: string): Promise<void> {
    await this.prismaService.userPasswordReset.delete({ where: { code } });
  }
}
