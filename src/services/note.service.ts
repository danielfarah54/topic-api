import { HttpStatus, Injectable } from '@nestjs/common';
import { Note } from '@prisma/client';

import { UuidInput } from '@/common/dtos/id.dto';
import { NoteCreateInput, NoteFilterInput, NoteUpdateInput } from '@/common/dtos/note.dto';
import { RequestException } from '@/common/exceptions/request-exception.exception';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { removeUndefinedKeys } from '@/common/utils/functions/remove-undefined-keys';
import { LocalStorageService } from '@/config/cls/cls.config';
import { NoteRepository } from '@/repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository, private readonly localStorageService: LocalStorageService) {}

  create(data: NoteCreateInput & { userId: string }): Promise<Note> {
    return this.noteRepository.create(data);
  }

  getAll(userId: string, data?: NoteFilterInput): Promise<Paginated<Note>> {
    return this.noteRepository.getAll(userId, data);
  }

  getAnyByTopicId(topicId: string): Promise<Note> {
    return this.noteRepository.getAnyByTopicId(topicId);
  }

  async getById(data: UuidInput & { userId: string }): Promise<Note> {
    const note = await this.noteRepository.getBy(data);

    if (!note) {
      throw new RequestException('NoteNotFound', HttpStatus.BAD_REQUEST);
    }

    return note;
  }

  getLastNoteByTopicId(data: { topicId: string; userId: string }): Promise<Note> {
    return this.noteRepository.getLastNoteBy(data);
  }

  async update(data: NoteUpdateInput & { userId: string }): Promise<Note> {
    const { id, userId, ...rest } = data;
    const currentNote = await this.noteRepository.getBy({ id, userId });

    if (!currentNote) {
      throw new RequestException('NoteNotFound', HttpStatus.BAD_REQUEST);
    }

    removeUndefinedKeys(rest);

    return this.noteRepository.update(id, { ...rest });
  }

  async delete(data: UuidInput & { userId: string }): Promise<Note> {
    const note = await this.noteRepository.getBy({ id: data.id, userId: data.userId });

    if (!note) {
      throw new RequestException('NoteNotFound', HttpStatus.BAD_REQUEST);
    }

    await this.noteRepository.delete(data.id);

    return note;
  }
}
