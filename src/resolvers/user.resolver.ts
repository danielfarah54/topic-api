import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';

import { User as UserDecorator } from '@/common/decorators/request-user.decorator';
import { UuidInput } from '@/common/dtos/id.dto';
import { UserFilterInput } from '@/common/dtos/user-filter.dto';
import { UserUpdateInput } from '@/common/dtos/user.dto';
import { authGuardian } from '@/common/guards/authentication/auth.guard';
import { Paginated } from '@/common/interfaces/paginated.interface';
import { PaginatedUserModel, UserModel } from '@/common/models/user.model';
import { UserService } from '@/services/user.service';

@Resolver(UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserModel)
  @UseGuards(authGuardian())
  user(@Args('data') data: UuidInput, @UserDecorator('id') userId: string): Promise<User> {
    return this.userService.getById(data.id, userId);
  }

  @Query(() => PaginatedUserModel)
  @UseGuards(authGuardian())
  users(@Args('data') data: UserFilterInput): Promise<Paginated<User>> {
    return this.userService.getAll(data);
  }

  @Mutation(() => UserModel)
  @UseGuards(authGuardian())
  updateUser(@Args('data') data: UserUpdateInput): Promise<User> {
    return this.userService.update(data);
  }
}
