import { Field, ObjectType } from '@nestjs/graphql';

import { PaginateModel } from './paginated.model';

@ObjectType('User')
export class UserModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@ObjectType('PaginatedUser')
export class PaginatedUserModel extends PaginateModel(UserModel) {}
