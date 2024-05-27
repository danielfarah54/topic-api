import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

export function PaginateModel<T>(ItemType: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedModel {
    @Field()
    totalPages: number;

    @Field()
    totalItems: number;

    @Field(() => [ItemType])
    data: Array<T>;
  }

  return PaginatedModel;
}
