import { Type } from 'class-transformer';
import { 
  IsArray, 
  ValidateNested, 
  IsString, 
  IsInt, 
  IsDate, 
  IsBoolean, 
  IsOptional, 
  IsNumber 
} from 'class-validator';

class ExamSubjectDto {
  @IsInt()
  subjectId: number;

  @IsDate()
  @Type(() => Date)
  examDate: Date;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  duration: number;

  @IsInt()
  maxMarks: number;

  @IsInt()
  minMarks: number;

  @IsOptional()
  @IsBoolean()
  isTheory?: boolean;

  @IsOptional()
  @IsBoolean()
  isPractical?: boolean;

  @IsOptional()
  @IsInt()
  practicalMarks?: number;

  @IsOptional()
  @IsInt()
  theoryMarks?: number;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateExamWithSubjectsDto {
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
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamSubjectDto)
  subjects: ExamSubjectDto[];
}