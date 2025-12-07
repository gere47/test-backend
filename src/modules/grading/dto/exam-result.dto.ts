

import { IsInt, IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ExamResultDto {
  @IsInt()
  studentId: number;

  @IsInt()
  subjectId: number;

  @IsOptional()
  @IsNumber()
  theoryMarks?: number;

  @IsOptional()
  @IsNumber()
  practicalMarks?: number;

  @IsOptional()
  @IsBoolean()
  isAbsent?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}