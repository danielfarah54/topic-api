import { Field, ObjectType } from '@nestjs/graphql';

import { NoteModel } from './note.model';
import { UserModel } from './user.model';

@ObjectType('Topic')
export class TopicModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => NoteModel, { nullable: true })
  lastNote: typeof NoteModel;

  @Field(() => UserModel)
  user: typeof UserModel;
}
