import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';

import { DataLoader } from '../loader';

export type UserSeedInput = Prisma.UserCreateInput;

export async function seedUsers(loader: DataLoader, seedInput: UserSeedInput[]): Promise<void> {
  loader.log.initial('Seeding Users...');
  await loader.handleGeneric(seedInput, {
    create: async (data: UserSeedInput) => {
      const { id } = await loader.prisma.user.upsert({
        where: {
          id: data.id,
          email: data.id ? undefined : data.email,
        },
        update: {
          name: data.name,
          email: data.email,
          password: hashSync(data.password, +process.env.BCRYPT_SALT_ROUNDS),
        },
        create: {
          id: data.id,
          name: data.name,
          email: data.email,
          password: hashSync(data.password, +process.env.BCRYPT_SALT_ROUNDS),
        },
        select: { id: true },
      });
      return id;
    },
  });
  loader.log.done();
}
