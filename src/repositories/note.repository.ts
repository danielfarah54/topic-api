import { Injectable } from '@nestjs/common';
import { Note, Prisma } from '@prisma/client';

import { NoteFilterInput } from '@/common/dtos/note.dto';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { PrismaService } from '@/common/services/prisma.service';
import { getOrderBy } from '@/common/utils/prisma/order-by.util';
import { calculatePagination } from '@/common/utils/prisma/pagination.util';

@Injectable()
export class NoteRepository {
  constructor(private prismaService: PrismaService) {}

  create(data: Prisma.NoteUncheckedCreateInput): Promise<Note> {
    return this.prismaService.note.create({ data });
  }

  async getAll(userId: string, data?: NoteFilterInput): Promise<Paginated<Note>> {
    const { take, skip } = calculatePagination(data);

    const where = {
      ...(data?.title ? { title: { contains: data.title } } : {}),
      ...(data?.topicId ? { topicId: data.topicId } : {}),
      userId,
    };

    const totalItems = await this.prismaService.note.count({ where });
    const totalPages = Math.ceil(totalItems / take);

    const notes = await this.prismaService.note.findMany({
      where,
      skip,
      take,
      orderBy: getOrderBy(data?.orderBy) as Prisma.NoteOrderByWithRelationInput,
    });

    return {
      totalPages,
      totalItems,
      data: notes,
    };
  }

  getAnyByTopicId(topicId: string): Promise<Note> {
    return this.prismaService.note.findFirst({ where: { topicId } });
  }

  getBy(where: { id: string; userId: string }): Promise<Note> {
    return this.prismaService.note.findFirst({ where });
  }

  getLastNoteBy(where: { topicId: string; userId: string }): Promise<Note> {
    return this.prismaService.note.findFirst({
      where,
    });
  }

  update(id: string, data: Prisma.NoteUpdateInput): Promise<Note> {
    return this.prismaService.note.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.note.delete({ where: { id } });
  }
}
