import { Field, ObjectType } from '@nestjs/graphql';

import { PaginateModel } from './paginated.model';
import { TopicModel } from './topic.model';
import { UserModel } from './user.model';

@ObjectType('Note')
export class NoteModel {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  topicId: string;

  @Field(() => TopicModel)
  topic: typeof TopicModel;

  @Field(() => UserModel)
  user: typeof UserModel;
}

@ObjectType('PaginatedNote')
export class PaginatedNoteModel extends PaginateModel(NoteModel) {}
