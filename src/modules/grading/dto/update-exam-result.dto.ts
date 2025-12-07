import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateExamResultDto {
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

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}