import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { LocalStorageService } from '@/config/cls/cls.config';

/**
 * Middleware de internacionalização (I18n) para definir o idioma com base no cabeçalho "accept-language".
 */
@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly localStorageService: LocalStorageService) {}

  /**
   * Define o idioma com base no cabeçalho "accept-language" da solicitação.
   * @param req Objeto de solicitação HTTP.
   * @param res Objeto de resposta HTTP.
   * @param next Função para continuar a cadeia de middleware.
   */
  use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['accept-language'];
    this.localStorageService.set('lang', lang || 'en-US'); // Define o idioma no LocalStorageService
    next(); // Chama a próxima função na cadeia de middleware
  }
}
