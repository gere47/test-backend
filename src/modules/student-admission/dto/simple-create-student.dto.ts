import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class SimpleCreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsString()
  academicSession: string;

  @IsString()
  class: string;
}