import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { AuthenticationMethod } from '@/common/enums/env.enum';
import { IJwtPayload } from '@/common/interfaces/auth.interface';
import { GuardOptionsRequest } from '@/common/types/auth.type';
import { LocalStorageService } from '@/config/cls/cls.config';
import { SessionService } from '@/services/session.service';

/**
 * Estratégia de autenticação jwt.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthenticationMethod.JWT) {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
    private readonly localStorageService: LocalStorageService
  ) {
    super({
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token JWT do cabeçalho de autorização
      ignoreExpiration: false, // Verifica se o token JWT expirou
      secretOrKey: configService.getOrThrow('JWT_SECRET'), // Define a chave secreta para verificar a assinatura do token JWT
    } as StrategyOptions);
  }

  /**
   * Validação do payload do token JWT.
   * @param req Objeto de solicitação HTTP.
   * @param payload Payload do token JWT.
   * @returns Objeto com o ID do usuário.
   *
   */
  async validate(req: GuardOptionsRequest, payload: IJwtPayload) {
    await this.handleTokenValidation(payload, req);

    this.localStorageService.set('userId', payload.sub);

    return { id: payload.sub };
  }

  async handleTokenValidation(payload: IJwtPayload, req: Request) {
    const id = payload.sub;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const userCurrentToken = await this.sessionService.findTokenByUserId(id);

    if (userCurrentToken.token !== token) {
      return this.fail('InvalidToken', HttpStatus.UNAUTHORIZED);
    }
  }
}
