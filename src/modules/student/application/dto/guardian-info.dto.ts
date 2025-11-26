// src/modules/student/application/dto/guardian-info.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GuardianInfoDto {
  @ApiProperty({ example: 'Michael' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Father' })
  @IsNotEmpty()
  @IsString()
  relationship: string;

  @ApiPropertyOptional({ example: 'michael.smith@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+251911223355' })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({ example: 'Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: '123 Main St, Addis Ababa' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}