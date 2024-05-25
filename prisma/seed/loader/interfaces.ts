import { NoteSeedInput } from '../entities/note';
import { TopicSeedInput } from '../entities/topic';
import { UserSeedInput } from '../entities/user';

export interface NeedsFlag {
  '#if'?: string | Array<string>;
}

export interface RemapsId {
  '#id'?: string;
}

export interface SeedData {
  users?: Array<UserSeedInput>;
  notes?: Array<NoteSeedInput>;
  topics?: Array<TopicSeedInput>;
}

export interface DataLoaderHandleGenericParams {
  create: (data: any) => Promise<any>;
  createMany?: (data: Array<any>) => Promise<any>;
  mode?: 'serial' | 'parallel';
}
