import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class GradeStudentDto {
  @IsInt()
  studentId: number;

  @IsInt()
  subjectId: number;

  @IsNumber()
  marksObtained: number;

  @IsNumber()
  maxMarks: number;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsNumber()
  gradePoint?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}