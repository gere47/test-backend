import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsInt, 
  IsOptional,
  IsPhoneNumber 
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  roleId: number;

  @IsOptional()
 @IsPhoneNumber('ET')
  phone?: string;
}