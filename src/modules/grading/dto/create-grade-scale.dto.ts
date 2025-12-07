import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateGradeScaleDto {
  @IsString()
  grade: string;

  @IsNumber()
  minPercent: number;

  @IsNumber()
  maxPercent: number;

  @IsNumber()
  gradePoint: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}