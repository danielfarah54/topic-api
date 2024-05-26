import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TopicFilterInput } from '@/common/dtos/topic.dto';
import { PrismaService } from '@/common/services/prisma.service';
import { getOrderBy } from '@/common/utils/prisma/order-by.util';

@Injectable()
export class TopicRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: Prisma.TopicUncheckedCreateInput) {
    return this.prismaService.topic.create({ data });
  }

  async getById(id: string) {
    return this.prismaService.topic.findFirst({ where: { id } });
  }

  async getAll(data?: TopicFilterInput) {
    const where = {
      ...(data?.name ? { name: { contains: data.name } } : {}),
    };

    return this.prismaService.topic.findMany({
      where,
      orderBy: getOrderBy(data?.orderBy) as Prisma.TopicOrderByWithRelationInput,
    });
  }

  async update(id: string, data: Prisma.TopicUpdateInput) {
    return this.prismaService.topic.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prismaService.topic.delete({ where: { id } });
  }
}
