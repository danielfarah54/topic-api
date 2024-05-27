import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { PaginationInput } from './pagination.dto';
import { OrderByInput } from '../enums/order-by.enum';
import { HasValue } from '../utils/functions/case-transform.util';

@InputType('NoteCreateInput')
export class NoteCreateInput {
  @MinLength(2)
  @MaxLength(180)
  @IsNotEmpty()
  @Field()
  title: string;

  @MinLength(2)
  @MaxLength(180)
  @IsNotEmpty()
  @IsOptional()
  @Field({ nullable: true })
  content?: string;

  @IsUUID('all')
  @IsNotEmpty()
  @Field()
  topicId: string;
}

@InputType('NoteUpdateInput')
export class NoteUpdateInput {
  @IsNotEmpty()
  @IsUUID('all')
  @Field()
  id: string;

  @HasValue()
  @IsOptional()
  @MinLength(2)
  @MaxLength(180)
  @Field({ nullable: true })
  title?: string;

  @HasValue()
  @IsOptional()
  @MinLength(2)
  @MaxLength(180)
  @Field({ nullable: true })
  content?: string;
}

@InputType('NoteFilterInput')
export class NoteFilterInput extends PaginationInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  title?: string;

  @IsUUID('all')
  @IsOptional()
  @Field({ nullable: true })
  topicId?: string;

  @IsEnum(OrderByInput)
  @IsOptional()
  @Field({ nullable: true })
  orderBy?: OrderByInput;
}

registerEnumType(OrderByInput, {
  name: 'OrderByInput',
});
