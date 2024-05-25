import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  async compare(data: string, cypher: string) {
    return compare(data, cypher);
  }

  async hash(data: string) {
    return hash(data, +this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'));
  }
}
