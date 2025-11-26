import { ValueObject } from 'src/core/domain/value-objects/base.vo';
import { BadRequestException } from '@nestjs/common';

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value.toLowerCase().trim());
  }

  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new BadRequestException('Invalid email format');
    }
    return new Email(email);
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getLocalPart(): string {
    return this.value.split('@')[0];
  }
}