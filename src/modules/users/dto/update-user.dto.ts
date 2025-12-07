// import { IsEmail, IsOptional, IsString, IsInt } from 'class-validator';

// export class UpdateUserDto {
//   @IsOptional()
//   @IsString()
//   firstName?: string;

//   @IsOptional()
//   @IsString()
//   lastName?: string;

//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   phone?: string;

//   @IsOptional()
//   @IsInt()
//   roleId?: number;

//   // IMPORTANT: NO PASSWORD HERE
// }


// src/modules/users/dto/update-user.dto.ts

import { IsEmail, IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  roleId?: number;

}
