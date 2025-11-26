// src/modules/student/application/dto/student-admission.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, IsArray, ValidateNested, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; 
import { Gender } from '../../domain/enums/gender.enum';


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
  isPrimary?: boolean;
}

export class EducationalBackgroundDto {
  @ApiProperty({ example: 'Sunshine Elementary School' })
  @IsNotEmpty()
  @IsString()
  institution: string;

  @ApiProperty({ example: 'Primary Education' })
  @IsNotEmpty()
  @IsString()
  qualification: string;

  @ApiProperty({ example: '2018-09-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2022-06-30' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ example: 'Completed primary education with excellent grades' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class StudentAdmissionDto {
  @ApiProperty({ example: 'Alice' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Johnson' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'alice.johnson@student.school.edu' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+251911223366' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ example: '2010-05-15' })
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ example: 'Ethiopian' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: 'Christian' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiProperty({ example: '123 School Street' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiPropertyOptional({ example: 'Ethiopia' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '1000' })
  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @ApiProperty({ example: '+251911223377' })
  @IsNotEmpty()
  @IsString()
  emergencyContact: string;

  @ApiPropertyOptional({ example: 'No known allergies' })
  @IsOptional()
  @IsString()
  medicalInfo?: string;

  @ApiProperty({ example: '2024-2025' })
  @IsNotEmpty()
  @IsString()
  academicYear: string;

  @ApiProperty({ example: 'Grade 5' })
  @IsNotEmpty()
  @IsString()
  class: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({ example: '25' })
  @IsOptional()
  @IsString()
  rollNumber?: string;

  @ApiPropertyOptional({ example: 'Transferred from another school' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [GuardianInfoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuardianInfoDto)
  guardians?: GuardianInfoDto[];

  @ApiPropertyOptional({ type: [EducationalBackgroundDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationalBackgroundDto)
  educationalBackground?: EducationalBackgroundDto[];
}