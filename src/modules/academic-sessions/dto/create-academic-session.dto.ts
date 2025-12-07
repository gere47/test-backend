
import { IsString, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAcademicSessionDto {
  @ApiProperty({ description: 'Academic session name', example: '2024-2025' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Start date', example: '2024-04-01' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2025-03-31' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Whether admission is open', default: true })
  @IsOptional()
  @IsBoolean()
  admissionOpen?: boolean;

  @ApiPropertyOptional({ description: 'Whether session is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}