import fs from 'fs';
import * as path from 'path';
import * as process from 'process';

import { Injectable, Logger } from '@nestjs/common';

import { LocalStorageService } from '@/config/cls/cls.config';

/**
 * Serviço de internacionalização (I18n) para tradução de mensagens.
 */
@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  constructor(private readonly localStorageService: LocalStorageService) {}

  /**
   * Traduz uma mensagem de exceção.
   * @param exception Mensagem da exceção a ser traduzida.
   * @returns Mensagem traduzida ou a mensagem original se a tradução não for encontrada.
   */
  async translateException(exception: string): Promise<string> {
    const translations = await this.getTranslationsFile('exceptions.json');

    const message = translations[exception];
    if (!message) {
      this.logger.log(`\nTradução não encontrada para o erro: ${exception}`);
      return exception;
    }

    return message;
  }

  /**
   * Obtém o conteúdo de um arquivo de traduções.
   * @param fileName Nome do arquivo de traduções.
   * @returns Conteúdo do arquivo de traduções.
   */
  private async getTranslationsFile(fileName: string) {
    const lang: string = this.localStorageService.get('lang');
    const requestedFilePath = path.join(process.cwd(), 'i18n', lang, fileName);
    const defaultFilePath = path.join(process.cwd(), 'i18n', 'en-US', fileName);

    try {
      const requestedFileContent = fs.readFileSync(requestedFilePath, 'utf-8');
      return JSON.parse(requestedFileContent);
    } catch (error) {
      const defaultFileContent = fs.readFileSync(defaultFilePath, 'utf-8');
      return JSON.parse(defaultFileContent);
    }
  }
}
