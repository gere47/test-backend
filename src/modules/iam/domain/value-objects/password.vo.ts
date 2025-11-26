import { ValueObject } from '../../../../core/domain/value-objects/base.vo';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export class Password extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(plainPassword: string): Password {
    if (!this.isValid(plainPassword)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
      );
    }
    const hashedPassword = this.hashPassword(plainPassword);
    return new Password(hashedPassword);
  }

  private static isValid(password: string): boolean {
    if (password.length < 8) return false;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  private static hashPassword(plainPassword: string): string {
    const saltRounds = 12;
    return bcrypt.hashSync(plainPassword, saltRounds);
  }

  compare(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.value);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  isHashed(): boolean {
    return this.value.startsWith('$2b$') || this.value.startsWith('$2a$');
  }
}