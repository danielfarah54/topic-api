import { Global, Module } from '@nestjs/common';
import { ClsModule, ClsService } from 'nestjs-cls';

import { ILocalStorageParameters } from '@/common/interfaces/local-storage.interface';

export class LocalStorageService extends ClsService<ILocalStorageParameters> {}

/**
 * Módulo para encapsular o uso da biblioteca CLS e fornecer um local storage exclusivo para cada requisição.
 */
@Global()
@Module({
  imports: [ClsModule.forFeature()],
  providers: [
    /**
     * Provedor que fornece o serviço de LocalStorage usando a implementação do ClsService.
     */
    {
      provide: LocalStorageService,
      useExisting: ClsService,
    },
  ],
  exports: [LocalStorageService],
})
export class LocalStorageModule {}
