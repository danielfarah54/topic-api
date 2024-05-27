import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { UserFilterInput } from '@/common/dtos/user-filter.dto';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { PrismaService } from '@/common/services/prisma.service';
import { getOrderBy } from '@/common/utils/prisma/order-by.util';
import { calculatePagination } from '@/common/utils/prisma/pagination.util';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async getAll(data: UserFilterInput): Promise<Paginated<User>> {
    const { take, skip } = calculatePagination(data);

    const where = {
      ...(data.name ? { name: { contains: data.name } } : {}),
    };

    const totalItems = await this.prismaService.user.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const users = await this.prismaService.user.findMany({
      where,
      skip,
      take,
      orderBy: getOrderBy(data.orderBy) as Prisma.UserOrderByWithRelationInput,
    });

    return {
      totalPages,
      totalItems,
      data: users,
    };
  }

  getById(id: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id } });
  }

  getByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({ where: { id }, data });
  }

  hardDelete(id: string): Promise<User> {
    return this.prismaService.user.delete({ where: { id } });
  }
}
