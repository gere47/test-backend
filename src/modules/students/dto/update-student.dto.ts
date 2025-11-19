import { ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateStudentDto, StudentStatus } from './create-student.dto';

export class UpdateStudentDto extends PartialType(
  OmitType(CreateStudentDto, ['password', 'username'] as const)
) {
  @ApiPropertyOptional({ 
    enum: StudentStatus, 
    example: StudentStatus.ACTIVE,
    description: 'Student status (Active, Inactive, Passed Out, Transferred)'
  })
  @IsEnum(StudentStatus)
  @IsOptional()
  status?: StudentStatus;
}