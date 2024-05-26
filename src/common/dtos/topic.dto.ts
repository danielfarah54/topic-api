import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { OrderByInput } from '../enums/order-by.enum';
import { ToUpperCase } from '../utils/functions/case-transform.util';

@InputType('TopicCreateInput')
export class TopicCreateInput {
  @MinLength(2)
  @MaxLength(180)
  @IsString()
  @ToUpperCase()
  @Field()
  name: string;
}

@InputType('TopicUpdateInput')
export class TopicUpdateInput {
  @IsNotEmpty()
  @IsUUID('all')
  @Field()
  id: string;

  @IsString()
  @MinLength(2)
  @MaxLength(180)
  @Field({ nullable: true })
  name: string;
}

@InputType('TopicFilterInput')
export class TopicFilterInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsEnum(OrderByInput)
  @IsOptional()
  @Field({ nullable: true })
  orderBy?: OrderByInput;
}

registerEnumType(OrderByInput, {
  name: 'OrderByInput',
});
