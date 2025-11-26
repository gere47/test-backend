// src/core/domain/value-objects/base.vo.ts
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  public equals(other: ValueObject<T>): boolean {
    return this._value === other._value;
  }

  public get value(): T {
    return this._value;
  }
}