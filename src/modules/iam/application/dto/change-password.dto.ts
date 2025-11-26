// src/modules/iam/application/dto/change-password.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123!' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newSecurePassword456!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}