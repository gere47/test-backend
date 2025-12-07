import {  IsDateString, IsInt, 
  IsString, 
  IsIn,  IsArray, ArrayMinSize, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendanceDto } from './create-attendance.dto';

class AttendanceRecordDto {
  @IsInt()
  studentId: number;

  @IsIn(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'])
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class BulkAttendanceDto {
  @IsInt()
  classId: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsInt()
  subjectId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  attendanceRecords: AttendanceRecordDto[];
}
