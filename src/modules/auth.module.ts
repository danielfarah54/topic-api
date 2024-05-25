import { Module } from '@nestjs/common';

import { JwtStrategy } from '@/common/passport/jwt.strategy';
import { BcryptService } from '@/common/services/bcrypt.service';
import { UserPasswordResetModule } from '@/modules/user-password-reset.module';
import { AuthResolver } from '@/resolvers/auth.resolver';
import { AuthService } from '@/services/auth.service';

import { UserModule } from './user.module';

/**
 * Módulo de autenticação da aplicação.
 * Configura controllers, providers e importações relacionadas à autenticação.
 */
@Module({
  imports: [UserModule, UserPasswordResetModule],
  providers: [AuthService, AuthResolver, BcryptService, JwtStrategy],
})
export class AuthModule {}
