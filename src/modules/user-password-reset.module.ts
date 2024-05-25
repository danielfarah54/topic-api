import { Module } from '@nestjs/common';

import { BcryptService } from '@/common/services/bcrypt.service';
import { UserModule } from '@/modules/user.module';
import { UserPasswordResetRepository } from '@/repositories/user-password-reset.repository';
import { UserPasswordResetService } from '@/services/user-password-reset.service';

@Module({
  imports: [UserModule],
  providers: [UserPasswordResetRepository, UserPasswordResetService, BcryptService],
  exports: [UserPasswordResetRepository, UserPasswordResetService],
})
export class UserPasswordResetModule {}
