import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignClassDto {
  @ApiProperty({ example: 3, description: 'Class ID to assign the student to' })
  @IsInt()
  classId: number;

  @ApiProperty({ example: 'A', required: false })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({ example: 'Promoted to next grade', required: false })
  @IsString()
  @IsOptional()
  remarks?: string;
}
