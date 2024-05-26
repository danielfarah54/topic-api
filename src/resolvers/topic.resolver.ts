import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Topic } from '@prisma/client';

import { User } from '@/common/decorators/request-user.decorator';
import { UuidInput } from '@/common/dtos/id.dto';
import { TopicCreateInput, TopicFilterInput, TopicUpdateInput } from '@/common/dtos/topic.dto';
import { authGuardian } from '@/common/guards/authentication/auth.guard';
import { NoteModel } from '@/common/models/note.model';
import { TopicModel } from '@/common/models/topic.model';
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
  async createTopic(@Args('data') data: TopicCreateInput, @User('id') userId: string) {
    return this.topicService.create({ ...data, userId });
  }

  @Query(() => TopicModel)
  async getTopic(@Args('data') data: UuidInput) {
    return this.topicService.getById(data.id);
  }

  @Query(() => [TopicModel])
  async getTopics(@Args('data', { nullable: true }) data?: TopicFilterInput) {
    return this.topicService.getAll(data);
  }

  @Mutation(() => TopicModel)
  @UseGuards(authGuardian())
  async updateTopic(@Args('data') data: TopicUpdateInput) {
    return this.topicService.update(data);
  }

  @Mutation(() => TopicModel)
  @UseGuards(authGuardian())
  async deleteTopic(@Args('data') data: UuidInput) {
    return this.topicService.delete(data);
  }

  @ResolveField(() => NoteModel)
  async lastNote(@Parent() topic: Topic) {
    return this.noteService.getLastNoteByTopicId(topic.id);
  }

  @ResolveField(() => UserModel)
  async user(@Parent() topic: Topic) {
    return this.userService.getById(topic.userId);
  }
}
