// export class EducationalBackgroundDto {
//   schoolName: string;
//   level: string;
//   startDate: string;
//   endDate?: string;
//   grade?: string;
//   description?: string;
// }

// dto/educational-background.dto.ts
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsDateString 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EducationalBackgroundDto {
  @ApiProperty({ description: 'Name of the school/institution' })
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiProperty({ description: 'Education level (e.g., Primary, Secondary, High School)' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({ description: 'Start date of education', example: '2020-01-15' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ description: 'End date of education', example: '2024-06-30' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Grade/Class achieved' })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiPropertyOptional({ description: 'Additional notes or description' })
  @IsString()
  @IsOptional()
  description?: string;
}