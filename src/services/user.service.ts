import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { SignUpInput } from '@/common/dtos/auth.dto';
import { UserFilterInput } from '@/common/dtos/user-filter.dto';
import { UserUpdateInput } from '@/common/dtos/user.dto';
import { RequestException } from '@/common/exceptions/request-exception.exception';
import { BcryptService } from '@/common/services/bcrypt.service';
import { removeUndefinedKeys } from '@/common/utils/functions/remove-undefined-keys';
import { RollbackManager } from '@/common/utils/functions/rollback.util';
import { UserRepository } from '@/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private readonly bcryptService: BcryptService) {}

  async create(data: SignUpInput) {
    const userEmail = await this.userRepository.getByEmail(data.email);

    if (userEmail) {
      throw new RequestException('EmailAlreadyInUse', HttpStatus.BAD_REQUEST);
    }

    return this.userRepository.create({
      ...data,
      password: await this.bcryptService.hash(data.password),
    });
  }

  async getAll(data: UserFilterInput) {
    return this.userRepository.getAll(data);
  }

  async getById(id: string, userIdFromToken?: string) {
    if (userIdFromToken) {
      const userFromToken = await this.userRepository.getById(userIdFromToken);
      if (userFromToken.id !== id) {
        throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);
      }
    }

    const user = await this.userRepository.getById(id);

    if (!user) throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);

    return user;
  }

  async update(data: UserUpdateInput) {
    const { id, ...rest } = data;
    const rollback = new RollbackManager();
    const currentUser = await this.userRepository.getById(id);

    if (!currentUser) throw new RequestException('UserNotFound', HttpStatus.BAD_REQUEST);

    if (data.email && data.email !== currentUser.email) {
      const userEmail = await this.userRepository.getByEmail(data.email);
      if (userEmail) throw new RequestException('EmailAlreadyInUse', HttpStatus.BAD_REQUEST);
    }

    let userUpdated: User = undefined;

    removeUndefinedKeys(rest);

    await rollback.step({
      forward: async () => {
        userUpdated = await this.userRepository.update(id, { ...rest });
      },
      backward: async () => {
        await this.userRepository.update(id, currentUser);
      },
    });

    return userUpdated;
  }
}
