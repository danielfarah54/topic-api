import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationInput } from './pagination.dto';
import { OrderByInput } from '../enums/order-by.enum';

@InputType('UserFilterInput')
export class UserFilterInput extends PaginationInput {
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
  name: 'DefaultOrderByInput',
});
