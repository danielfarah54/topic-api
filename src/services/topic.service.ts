import { HttpStatus, Injectable } from '@nestjs/common';
import { Topic } from '@prisma/client';

import { UuidInput } from '@/common/dtos/id.dto';
import { TopicCreateInput, TopicFilterInput, TopicUpdateInput } from '@/common/dtos/topic.dto';
import { RequestException } from '@/common/exceptions/request-exception.exception';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { TopicRepository } from '@/repositories/topic.repository';
import { NoteService } from '@/services/note.service';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository, private readonly noteService: NoteService) {}

  create(data: TopicCreateInput & { userId: string }): Promise<Topic> {
    return this.topicRepository.create(data);
  }

  async getById(id: string): Promise<Topic> {
    const topic = await this.topicRepository.getBy({ id });

    if (!topic) throw new RequestException('TopicNotFound', HttpStatus.BAD_REQUEST);

    return topic;
  }

  getAll(data?: TopicFilterInput): Promise<Paginated<Topic>> {
    return this.topicRepository.getAll(data);
  }

  async update(data: TopicUpdateInput & { userId: string }): Promise<Topic> {
    const topic = await this.topicRepository.getBy({ id: data.id, userId: data.userId });

    if (!topic) {
      throw new RequestException('TopicNotFound', HttpStatus.BAD_REQUEST);
    }

    const hasNotes = await this.noteService.getAnyByTopicId(topic.id);

    if (hasNotes) {
      throw new RequestException('TopicHasNotes', HttpStatus.BAD_REQUEST);
    }

    return this.topicRepository.update(data.id, { name: data.name });
  }

  async delete(data: UuidInput & { userId: string }): Promise<Topic> {
    const topic = await this.topicRepository.getBy({ id: data.id, userId: data.userId });

    if (!topic) {
      throw new RequestException('TopicNotFound', HttpStatus.BAD_REQUEST);
    }

    const hasNotes = await this.noteService.getAnyByTopicId(topic.id);

    if (hasNotes) {
      throw new RequestException('TopicHasNotes', HttpStatus.BAD_REQUEST);
    }

    await this.topicRepository.delete(data.id);

    return topic;
  }
}
