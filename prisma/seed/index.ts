import 'reflect-metadata';
import { error } from 'console';

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

import { Environment } from '@/common/enums/env.enum';
import { getEnvFilePath } from '@/config/environment/env.config';

import { seedNotes } from './entities/note';
import { seedTopics } from './entities/topic';
import { seedUsers } from './entities/user';
import { DataLoader } from './loader';

const prisma = new PrismaClient();
const environmentPath = getEnvFilePath();
expand(config({ path: environmentPath }));

function flags(): string[] {
  const set = new Set<string>();

  const currentEnv = process.env.NODE_ENV;

  for (const env of Object.values(Environment)) {
    set.add(currentEnv === env ? `env/${env}` : `NOT env/${env}`);
  }

  return [...set];
}

async function main() {
  const loader = new DataLoader(prisma, flags());
  const data = await loader.readSeeds();

  if (flags().includes('env/prd')) return;

  if (data.users) {
    await seedUsers(loader, data.users);
  }

  if (data.topics) {
    await seedTopics(loader, data.topics);
  }

  if (data.notes) {
    await seedNotes(loader, data.notes);
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
