// src/modules/student-admission/dto/admission-test.dto.ts
import { IsString, IsDate, IsOptional, IsNumber, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdmissionTestDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  testDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  subjectScores?: Record<string, number>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalMarks?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  obtainedMarks?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  percentage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}