import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

class GradeRecordDto {
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
  @IsString()
  remarks?: string;
}

export class BulkGradesDto {
  @IsInt()
  examId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GradeRecordDto)
  records: GradeRecordDto[];
}