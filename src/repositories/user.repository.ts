import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserFilterInput } from '@/common/dtos/user-filter.dto';
import { PrismaService } from '@/common/services/prisma.service';
import { getOrderBy } from '@/common/utils/prisma/order-by.util';
import { calculatePagination } from '@/common/utils/prisma/pagination.util';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.UserUncheckedCreateInput) {
    return this.prismaService.user.create({ data });
  }

  async getAll(data: UserFilterInput) {
    const { take, skip } = calculatePagination(data);

    const where = {
      ...(data.name ? { name: { contains: data.name } } : {}),
    };

    const totalUsers = await this.prismaService.user.count({ where });
    const totalPages = Math.ceil(totalUsers / take);

    const users = await this.prismaService.user.findMany({
      where,
      skip,
      take,
      orderBy: getOrderBy(data.orderBy) as Prisma.UserOrderByWithRelationInput,
    });

    return {
      totalPages,
      totalUsers,
      data: users,
    };
  }

  async getById(id: string) {
    return this.prismaService.user.findFirst({ where: { id } });
  }

  async getByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({ where: { id }, data });
  }

  async hardDelete(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
