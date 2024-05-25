import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}

@ObjectType('PaginatedUser')
export class PaginatedUserModel {
  @Field()
  totalPages: number;

  @Field()
  totalUsers: number;

  @Field(() => [UserModel])
  data: Array<UserModel>;
}
