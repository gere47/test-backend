import { AggregateRoot } from '@nestjs/cqrs';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { PasswordChangedEvent } from '../events/password-changed.event';

export class User extends AggregateRoot {
  constructor(
    public readonly id: UserId,
    public readonly email: Email,
    private password: Password,
    public readonly role: UserRole,
    public status: UserStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public lastLoginAt?: Date,
    public failedLoginAttempts: number = 0,
    public lockoutUntil?: Date,
    public profileImage?: string,
  ) {
    super();
  }

  static create(
    email: string,
    plainPassword: string,
    role: UserRole,
    firstName?: string,
    lastName?: string,
    phone?: string,
  ): User {
    const userId = UserId.create();
    const userEmail = Email.create(email);
    const userPassword = Password.create(plainPassword);
    
    const user = new User(
      userId,
      userEmail,
      userPassword,
      role,
      UserStatus.ACTIVE,
      new Date(),
      new Date(),
      firstName,
      lastName,
      phone
    );

    user.apply(new UserCreatedEvent(userId.value, userEmail.value, role));
    return user;
  }

  updatePassword(newPlainPassword: string): void {
    const oldPassword = this.password;
    this.password = Password.create(newPlainPassword);
    this.updatedAt = new Date();
    
    this.apply(new PasswordChangedEvent(this.id.value, this.email.value));
  }

  updateProfile(firstName: string, lastName: string, phone?: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.updatedAt = new Date();
  }

  markLoginSuccess(): void {
    this.lastLoginAt = new Date();
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.updatedAt = new Date();
  }

  markLoginFailure(): void {
    this.failedLoginAttempts += 1;
    this.updatedAt = new Date();

    if (this.failedLoginAttempts >= 5) {
      this.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
  }

  isLocked(): boolean {
    if (!this.lockoutUntil) return false;
    return this.lockoutUntil > new Date();
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE && !this.isLocked();
  }

  hasRole(role: UserRole): boolean {
    return this.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.role);
  }

  validatePassword(plainPassword: string): boolean {
    return this.password.compare(plainPassword);
  }

  suspend(): void {
    this.status = UserStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
    this.failedLoginAttempts = 0;
    this.lockoutUntil = undefined;
    this.updatedAt = new Date();
  }

  getRemainingLockoutTime(): number {
    if (!this.lockoutUntil) return 0;
    return Math.max(0, this.lockoutUntil.getTime() - Date.now());
  }

  getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
}