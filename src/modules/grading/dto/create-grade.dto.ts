import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGradeDto {
  @IsInt()
  studentId: number;

  @IsInt()
  examId: number;

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
  @IsString()
  remarks?: string;
}