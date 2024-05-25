import { Module } from '@nestjs/common';

import { BcryptService } from '@/common/services/bcrypt.service';
import { UserRepository } from '@/repositories/user.repository';
import { UserResolver } from '@/resolvers/user.resolver';
import { UserService } from '@/services/user.service';

@Module({
  providers: [UserRepository, UserResolver, UserService, BcryptService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
