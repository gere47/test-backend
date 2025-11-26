import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserRole } from '../enums/user-role.enum';

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByRole(role: UserRole): Promise<User[]>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
  exists(email: Email): Promise<boolean>;
}