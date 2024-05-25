import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/env/.env.local' });

@Injectable()
export class TestConfigService {
  get(key: string) {
    return process.env[key];
  }
  getOrThrow(key: string) {
    const value = process.env[key];
    if (!value) throw new Error(`Missing env var ${key}`);
  }
}
