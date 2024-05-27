import { Module } from '@nestjs/common';

import { TopicModule } from '@/modules/topic.module';
import { UserModule } from '@/modules/user.module';
import { NoteRepository } from '@/repositories/note.repository';
import { NoteResolver } from '@/resolvers/note.resolver';
import { NoteService } from '@/services/note.service';

@Module({
  imports: [TopicModule, UserModule],
  providers: [NoteRepository, NoteResolver, NoteService],
  exports: [NoteRepository, NoteService],
})
export class NoteModule {}
