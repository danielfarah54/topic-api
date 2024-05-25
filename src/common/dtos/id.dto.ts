import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType('UuidInput')
export class UuidInput {
  @IsUUID('all')
  @IsNotEmpty()
  @Field()
  id: string;
}

@InputType('OptionalUuidInput')
export class OptionalUuidInput {
  @IsUUID('all')
  @IsNotEmpty()
  @IsOptional()
  @Field({ nullable: true })
  id?: string;
}

@InputType('IdInput')
export class IdInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  id: string;
}
