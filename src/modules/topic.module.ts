import { Module } from '@nestjs/common';

import { NoteModule } from '@/modules/note.module';
import { UserModule } from '@/modules/user.module';
import { TopicRepository } from '@/repositories/topic.repository';
import { TopicResolver } from '@/resolvers/topic.resolver';
import { TopicService } from '@/services/topic.service';

@Module({
  imports: [NoteModule, UserModule],
  providers: [TopicRepository, TopicResolver, TopicService],
  exports: [TopicRepository, TopicService],
})
export class TopicModule {}
