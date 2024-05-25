import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User as UserDecorator } from '@/common/decorators/request-user.decorator';
import { UuidInput } from '@/common/dtos/id.dto';
import { UserFilterInput } from '@/common/dtos/user-filter.dto';
import { UserUpdateInput } from '@/common/dtos/user.dto';
import { authGuardian } from '@/common/guards/authentication/auth.guard';
import { PaginatedUserModel, UserModel } from '@/common/models/user.model';
import { UserService } from '@/services/user.service';

@Resolver(UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  @UseGuards(authGuardian())
  async user(@Args('data') data: UuidInput, @UserDecorator('id') userId: string) {
    return this.userService.getById(data.id, userId);
  }

  @Query(() => PaginatedUserModel)
  @UseGuards(authGuardian())
  async users(@Args('data') data: UserFilterInput) {
    return this.userService.getAll(data);
  }

  @Mutation(() => UserModel)
  @UseGuards(authGuardian())
  async updateUser(@Args('data') data: UserUpdateInput) {
    return this.userService.update(data);
  }
}
