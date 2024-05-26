import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import { PaginationInput } from './pagination.dto';
import { OrderByInput } from '../enums/order-by.enum';
import { HasValue, ToLowerCase } from '../utils/functions/case-transform.util';

@InputType('UserUpdateInput')
export class UserUpdateInput {
  @IsNotEmpty()
  @IsUUID('all')
  @Field()
  id: string;

  @HasValue()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  @Field({ nullable: true })
  name?: string;

  @HasValue()
  @IsEmail()
  @IsOptional()
  @MinLength(2)
  @MaxLength(180)
  @ToLowerCase()
  @Field({ nullable: true })
  email?: string;
}

@InputType('UserGetAllInput')
export class UserGetAllInput extends PaginationInput {
  @IsEnum(OrderByInput)
  @IsOptional()
  @Field({ nullable: true })
  orderBy?: OrderByInput;
}

registerEnumType(OrderByInput, {
  name: 'DefaultOrderByInput',
});
