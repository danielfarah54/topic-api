import { Injectable } from '@nestjs/common';
import { Prisma, Topic } from '@prisma/client';

import { TopicFilterInput } from '@/common/dtos/topic.dto';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { PrismaService } from '@/common/services/prisma.service';
import { getOrderBy } from '@/common/utils/prisma/order-by.util';
import { calculatePagination } from '@/common/utils/prisma/pagination.util';

@Injectable()
export class TopicRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.TopicUncheckedCreateInput): Promise<Topic> {
    return this.prismaService.topic.create({ data });
  }

  getBy(data: { id: string; userId?: string }): Promise<Topic> {
    const where = {
      id: data.id,
      ...(data.userId ? { userId: data.userId } : {}),
    };

    return this.prismaService.topic.findFirst({ where });
  }

  async getAll(data?: TopicFilterInput): Promise<Paginated<Topic>> {
    const { take, skip } = calculatePagination(data);

    const where = {
      ...(data?.name ? { name: { contains: data.name } } : {}),
    };

    const totalItems = await this.prismaService.topic.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const topics = await this.prismaService.topic.findMany({
      where,
      skip,
      take,
      orderBy: getOrderBy(data?.orderBy) as Prisma.TopicOrderByWithRelationInput,
    });

    return {
      totalPages,
      totalItems,
      data: topics,
    };
  }

  update(id: string, data: Prisma.TopicUpdateInput): Promise<Topic> {
    return this.prismaService.topic.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.topic.delete({ where: { id } });
  }
}
