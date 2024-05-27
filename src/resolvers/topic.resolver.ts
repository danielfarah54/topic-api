import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Note, Topic, User } from '@prisma/client';

import { User as UserDecorator } from '@/common/decorators/request-user.decorator';
import { UuidInput } from '@/common/dtos/id.dto';
import { TopicCreateInput, TopicFilterInput, TopicUpdateInput } from '@/common/dtos/topic.dto';
import { authGuardian } from '@/common/guards/authentication/auth.guard';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { NoteModel } from '@/common/models/note.model';
import { PaginatedTopicModel, TopicModel } from '@/common/models/topic.model';
import { UserModel } from '@/common/models/user.model';
import { NoteService } from '@/services/note.service';
import { TopicService } from '@/services/topic.service';
import { UserService } from '@/services/user.service';

@Resolver(TopicModel)
export class TopicResolver {
  constructor(
    private readonly topicService: TopicService,
    private readonly noteService: NoteService,
    private readonly userService: UserService
  ) {}

  @Mutation(() => TopicModel)
  @UseGuards(authGuardian())
  createTopic(@Args('data') data: TopicCreateInput, @UserDecorator('id') userId: string): Promise<Topic> {
    return this.topicService.create({ ...data, userId });
  }

  @Query(() => TopicModel)
  @UseGuards(authGuardian())
  getTopic(@Args('data') data: UuidInput): Promise<Topic> {
    return this.topicService.getById(data.id);
  }

  @Query(() => PaginatedTopicModel)
  @UseGuards(authGuardian())
  getTopics(@Args('data', { nullable: true }) data?: TopicFilterInput): Promise<Paginated<Topic>> {
    return this.topicService.getAll(data);
  }

  @Mutation(() => TopicModel)
  @UseGuards(authGuardian())
  updateTopic(@Args('data') data: TopicUpdateInput, @UserDecorator('id') userId: string): Promise<Topic> {
    return this.topicService.update({ ...data, userId });
  }

  @Mutation(() => TopicModel)
  @UseGuards(authGuardian())
  deleteTopic(@Args('data') data: UuidInput, @UserDecorator('id') userId: string): Promise<Topic> {
    return this.topicService.delete({ ...data, userId });
  }

  @ResolveField(() => NoteModel)
  lastNote(@Parent() topic: Topic, @UserDecorator('id') userId: string): Promise<Note> {
    return this.noteService.getLastNoteByTopicId({ topicId: topic.id, userId });
  }

  @ResolveField(() => UserModel)
  user(@Parent() topic: Topic): Promise<User> {
    return this.userService.getById(topic.userId);
  }
}
