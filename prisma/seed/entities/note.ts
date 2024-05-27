import { Prisma } from '@prisma/client';

import { DataLoader } from '../loader';

export type NoteSeedInput = Prisma.NoteUncheckedCreateInput;

export async function seedNotes(loader: DataLoader, seedInput: NoteSeedInput[]): Promise<void> {
  loader.log.initial('Seeding Notes...');
  await loader.handleGeneric(seedInput, {
    create: async (data: NoteSeedInput) => {
      const existing = await loader.prisma.note.findFirst({
        where: {
          id: data.id,
          ...(data.id ? undefined : { title: data.title }),
        },
      });

      if (existing) {
        await loader.prisma.note.update({
          where: {
            id: existing.id,
          },
          data: {
            title: data.title,
            content: data.content,
            userId: data.userId,
            topicId: data.topicId,
          },
        });
        return existing.id;
      }

      const { id } = await loader.prisma.note.create({
        data: {
          id: data.id,
          title: data.title,
          content: data.content,
          userId: data.userId,
          topicId: data.topicId,
        },
        select: { id: true },
      });
      return id;
    },
  });
  loader.log.done();
}
