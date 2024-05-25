import { Rollback } from '@/common/types/rollback.type';

export interface IStep<T> {
  forward: () => T | Promise<T>;
  backward?: Rollback;
}
