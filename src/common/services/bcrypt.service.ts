import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptService {
  constructor(private readonly configService: ConfigService) {}

  compare(data: string, cypher: string): Promise<boolean> {
    return compare(data, cypher);
  }

  hash(data: string): Promise<string> {
    return hash(data, +this.configService.getOrThrow('BCRYPT_SALT_ROUNDS'));
  }
}
