import { ValueObject } from 'src/core/domain/value-objects/base.vo';
import { v4 as uuidv4 } from 'uuid';

export class UserId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(): UserId {
    return new UserId(uuidv4());
  }

  static fromString(id: string): UserId {
    if (!this.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return new UserId(id);
  }

  private static isValid(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}