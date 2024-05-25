import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CLS_ID } from 'nestjs-cls';
import { v4 as uuidV4 } from 'uuid';

import { LocalStorageService } from '@/config/cls/cls.config';

@Injectable()
export class LocalStorageMiddleware implements NestMiddleware {
  constructor(private readonly localStorageService: LocalStorageService) {}

  /**
   * Executa o LocalStorageService durante a solicitação e atribui um ID único ao contexto.
   * @param req Objeto de solicitação HTTP.
   * @param res Objeto de resposta HTTP.
   * @param next Função para continuar a cadeia de middleware.
   */
  use(req: Request, res: Response, next: NextFunction) {
    this.localStorageService.run(() => {
      this.localStorageService.set(CLS_ID, uuidV4()); // Atribui um ID único ao contexto
      return next(); // Chama a próxima função na cadeia de middleware
    });
  }
}
