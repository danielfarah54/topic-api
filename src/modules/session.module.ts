import { Global, Module } from '@nestjs/common';

import { SessionRepository } from '@/repositories/session.repository';
import { SessionService } from '@/services/session.service';

@Global()
@Module({
  providers: [SessionRepository, SessionService],
  exports: [SessionRepository, SessionService],
})
export class SessionModule {}
