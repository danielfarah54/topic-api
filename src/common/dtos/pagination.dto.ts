import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';

@InputType('PaginationInput')
export class PaginationInput {
  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  page?: number;

  @IsInt()
  @IsOptional()
  @Field({ nullable: true })
  pageSize?: number;
}
