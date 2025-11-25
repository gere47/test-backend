import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAcademicSessionDto {
  @IsString()
  name: string; // Add this missing property

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  admissionOpen?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
