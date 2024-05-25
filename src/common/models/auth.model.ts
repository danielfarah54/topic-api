import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Auth')
export class AuthenticatedModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
