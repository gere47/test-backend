// src/modules/iam/application/services/password.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.rounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
