import { error } from 'console';

import { IStep } from '@/common/interfaces/step.interface';
import { Rollback } from '@/common/types/rollback.type';

/**
 * Define a sequence of steps to be executed (and how to undo them).
 * If the execution fails, the all executed steps will be undone.
 */
export class RollbackManager {
  private rollbacks: Rollback[] = [];

  async triggerRollback(): Promise<void> {
    await this.executeRollbacks();
  }

  async step<T = void>({ backward, forward }: IStep<T>): Promise<T> {
    try {
      const result = await forward();
      if (backward) {
        this.rollbacks.push(backward);
      }
      return result;
    } catch (err) {
      await this.executeRollbacks();
      return Promise.reject(err);
    }
  }

  private async executeRollbacks(): Promise<void> {
    for (const backward of [...this.rollbacks].reverse()) {
      try {
        await backward();
      } catch (suppressedError) {
        error('Error while rolling back (will not be thrown)', { suppressedError });
      }
    }
    this.rollbacks = [];
  }
}
