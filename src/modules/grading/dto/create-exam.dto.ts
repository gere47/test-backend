

import { IsString, IsInt, IsDate, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateExamDto {
  @IsString()
  name: string;

  @IsInt()
  examTypeId: number;

  @IsInt()
  classId: number;

  @IsInt()
  academicSessionId: number;

  @IsString()
  academicYear: string;

  @IsString()
  term: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber()
  totalWeightage?: number;

  @IsOptional()
  @IsString()
  passingCriteria?: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}