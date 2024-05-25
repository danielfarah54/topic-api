import { Prisma } from '@prisma/client';

import { DataLoader } from '../loader';

export type TopicSeedInput = Prisma.TopicUncheckedCreateInput;

export async function seedTopics(loader: DataLoader, seedInput: TopicSeedInput[]) {
  loader.log.initial('Seeding Topics...');
  await loader.handleGeneric(seedInput, {
    create: async (data: TopicSeedInput) => {
      const existing = await loader.prisma.topic.findFirst({
        where: {
          id: data.id,
          ...(data.id ? undefined : { name: data.name }),
        },
      });

      if (existing) {
        await loader.prisma.topic.update({
          where: {
            id: existing.id,
          },
          data: {
            name: data.name,
            userId: data.userId,
          },
        });
        return existing.id;
      }

      const { id } = await loader.prisma.topic.create({
        data: {
          id: data.id,
          name: data.name,
          userId: data.userId,
        },
        select: { id: true },
      });
      return id;
    },
  });
  loader.log.done();
}
