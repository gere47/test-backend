// src/modules/student/application/dto/educational-background.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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