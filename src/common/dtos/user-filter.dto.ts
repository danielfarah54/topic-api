import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationInput } from './pagination.dto';
import { DefaultOrderByInput } from '../enums/order-by.enum';

@InputType('UserFilterInput')
export class UserFilterInput extends PaginationInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsEnum(DefaultOrderByInput)
  @IsOptional()
  @Field({ nullable: true })
  orderBy?: DefaultOrderByInput;
}

registerEnumType(DefaultOrderByInput, {
  name: 'DefaultOrderByInput',
});
