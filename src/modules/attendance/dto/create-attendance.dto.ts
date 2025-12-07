import { IsInt, IsNotEmpty, IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  studentId: number;

  @IsInt()
  classId: number;

  @IsDateString()
  date: string;

  @IsIn(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'])
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

  @IsOptional()
  @IsInt()
  subjectId?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
