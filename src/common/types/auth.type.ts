import { Request } from 'express';

export type GuardOptionsRequest = Request & { authInfo: Request['authInfo'] };
