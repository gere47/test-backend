import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  passwordHash: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNumber()
  roleId: number;
}
