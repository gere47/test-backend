import { IsString, IsDecimal, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGradeScaleDto {
  @ApiProperty({ example: 'A+' })
  @IsString()
  grade: string;

  @ApiProperty({ example: 95.00 })
  @IsDecimal()
  minPercent: string;

  @ApiProperty({ example: 100.00 })
  @IsDecimal()
  maxPercent: string;

  @ApiProperty({ example: 4.0 })
  @IsDecimal()
  gradePoint: string;

  @ApiPropertyOptional({ example: 'Excellent' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateGradeScaleDto {
  @ApiPropertyOptional({ example: 90.00 })
  @IsOptional()
  @IsDecimal()
  minPercent?: string;

  @ApiPropertyOptional({ example: 94.99 })
  @IsOptional()
  @IsDecimal()
  maxPercent?: string;

  @ApiPropertyOptional({ example: 4.0 })
  @IsOptional()
  @IsDecimal()
  gradePoint?: string;

  @ApiPropertyOptional({ example: 'Excellent' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}