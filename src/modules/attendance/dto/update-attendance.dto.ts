import { IsOptional, IsIn, IsString } from 'class-validator';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsIn(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'])
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

  @IsOptional()
  @IsString()
  remarks?: string;
}
