import { Injectable } from '@nestjs/common';
import { Prisma, Session } from '@prisma/client';

import { SessionRepository } from '@/repositories/session.repository';

@Injectable()
export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  async save(data: Pick<Prisma.SessionCreateInput, 'token' | 'refresh'>, userId: string): Promise<Session> {
    const existingToken = await this.findTokenByUserId(userId);

    if (existingToken) {
      return this.sessionRepository.update(userId, data);
    }

    return this.sessionRepository.create(userId, data);
  }

  async invalidate(userId: string): Promise<boolean> {
    const existingToken = await this.findTokenByUserId(userId);

    if (existingToken) {
      await this.sessionRepository.hardDelete(userId);
      return true;
    }

    return false;
  }

  findTokenByUserId(userId: string): Promise<Session> {
    return this.sessionRepository.findByUserId(userId);
  }
}
