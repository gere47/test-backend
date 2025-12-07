import { Type } from 'class-transformer';
import { 
  IsArray, 
  ValidateNested, 
  IsInt, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsString 
} from 'class-validator';

class BulkExamResultDto {
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

export class BulkExamResultsDto {
  @IsInt()
  examId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkExamResultDto)
  results: BulkExamResultDto[];
}