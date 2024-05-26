import { HttpStatus, Injectable } from '@nestjs/common';

import { UuidInput } from '@/common/dtos/id.dto';
import { TopicCreateInput, TopicFilterInput, TopicUpdateInput } from '@/common/dtos/topic.dto';
import { RequestException } from '@/common/exceptions/request-exception.exception';
import { TopicRepository } from '@/repositories/topic.repository';
import { NoteService } from '@/services/note.service';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository, private readonly noteService: NoteService) {}

  async create(data: TopicCreateInput & { userId: string }) {
    return this.topicRepository.create(data);
  }

  async getById(id: string) {
    const topic = await this.topicRepository.getById(id);

    if (!topic) throw new RequestException('TopicNotFound', HttpStatus.BAD_REQUEST);

    return topic;
  }

  async getAll(data?: TopicFilterInput) {
    return this.topicRepository.getAll(data);
  }

  async update({ id, name }: TopicUpdateInput) {
    const currentTopic = await this.topicRepository.getById(id);

    if (!currentTopic) {
      throw new RequestException('TopicNotFound', HttpStatus.BAD_REQUEST);
    }

    return this.topicRepository.update(id, { name });
  }

  async delete(data: UuidInput) {
    const topic = await this.topicRepository.getById(data.id);

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
