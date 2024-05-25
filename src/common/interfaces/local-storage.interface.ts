import { ClsStore } from 'nestjs-cls';

export interface ILocalStorageParameters extends ClsStore {
  lang: string;
  userId: string;
  businessLogicData: any;
}
