import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Note, Topic, User } from '@prisma/client';

import { User as UserDecorator } from '@/common/decorators/request-user.decorator';
import { UuidInput } from '@/common/dtos/id.dto';
import { NoteCreateInput, NoteFilterInput, NoteUpdateInput } from '@/common/dtos/note.dto';
import { authGuardian } from '@/common/guards/authentication/auth.guard';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { NoteModel, PaginatedNoteModel } from '@/common/models/note.model';
import { TopicModel } from '@/common/models/topic.model';
import { UserModel } from '@/common/models/user.model';
import { NoteService } from '@/services/note.service';
import { TopicService } from '@/services/topic.service';
import { UserService } from '@/services/user.service';

@Resolver(NoteModel)
export class NoteResolver {
  constructor(
    private readonly noteService: NoteService,
    private readonly topicService: TopicService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => NoteModel)
  @UseGuards(authGuardian())
  createNote(@Args('data') data: NoteCreateInput, @UserDecorator('id') userId: string): Promise<Note> {
    return this.noteService.create({ ...data, userId });
  }

  @Query(() => NoteModel)
  @UseGuards(authGuardian())
  getNote(@Args('data') data: UuidInput, @UserDecorator('id') userId: string): Promise<Note> {
    return this.noteService.getById({ ...data, userId });
  }

  @Query(() => PaginatedNoteModel)
  @UseGuards(authGuardian())
  getNotes(
    @UserDecorator('id') userId: string,
    @Args('data', { nullable: true }) data?: NoteFilterInput
  ): Promise<Paginated<Note>> {
    return this.noteService.getAll(userId, data);
  }

  @Mutation(() => NoteModel)
  @UseGuards(authGuardian())
  updateNote(@Args('data') data: NoteUpdateInput, @UserDecorator('id') userId: string): Promise<Note> {
    return this.noteService.update({ ...data, userId });
  }

  @Mutation(() => NoteModel)
  @UseGuards(authGuardian())
  deleteNote(@Args('data') data: UuidInput, @UserDecorator('id') userId: string): Promise<Note> {
    return this.noteService.delete({ ...data, userId });
  }

  @ResolveField(() => TopicModel)
  topic(@Parent() note: Note): Promise<Topic> {
    return this.topicService.getById(note.topicId);
  }

  @ResolveField(() => UserModel)
  user(@Parent() note: Note): Promise<User> {
    return this.userService.getById(note.userId);
  }
}
