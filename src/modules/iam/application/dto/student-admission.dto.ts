import { 
  IsString, 
  IsEmail, 
  IsDate, 
  IsEnum, 
  IsNotEmpty, 
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
  IsArray 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../../../student/domain/enums/gender.enum';

export class GuardianInfoDto {
  @ApiProperty({ example: 'John', description: 'Guardian first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Guardian last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    example: 'parent@email.com', 
    description: 'Guardian email address' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '+1234567890', 
    description: 'Guardian phone number' 
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ 
    example: 'Father', 
    description: 'Relationship to student',
    enum: ['Father', 'Mother', 'Guardian', 'Other']
  })
  @IsString()
  @IsNotEmpty()
  relationship: string;
}

export class EducationalBackgroundDto {
  @ApiProperty({ example: 'ABC Primary School', description: 'Previous school name' })
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiProperty({ example: '2023', description: 'Year of completion' })
  @IsString()
  @IsNotEmpty()
  completionYear: string;

  @ApiProperty({ example: 'Elementary', description: 'Level completed' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiPropertyOptional({ example: 'Honors student', description: 'Any achievements' })
  @IsString()
  @IsOptional()
  achievements?: string;
}

export class StudentAdmissionDto {
  @ApiProperty({ example: 'John', description: 'Student first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Student last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    example: '2005-03-15', 
    description: 'Date of birth (YYYY-MM-DD)' 
  })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ 
    example: 'MALE', 
    description: 'Student gender',
    enum: Gender 
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ 
    example: 'john.doe@student.sophortech.edu', 
    description: 'Student email address' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '+1234567890', 
    description: 'Student phone number (optional)' 
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    example: '123 Main St, City, State', 
    description: 'Residential address' 
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ 
    description: 'Guardian information',
    type: GuardianInfoDto 
  })
  @ValidateNested()
  @Type(() => GuardianInfoDto)
  guardian: GuardianInfoDto;

  @ApiPropertyOptional({ 
    description: 'Educational background',
    type: [EducationalBackgroundDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationalBackgroundDto)
  @IsOptional()
  educationalBackground?: EducationalBackgroundDto[];

  @ApiProperty({ 
    example: 'GRADE_10', 
    description: 'Admission grade/class',
    enum: ['GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12']
  })
  @IsString()
  @IsNotEmpty()
  admissionGrade: string;

  @ApiPropertyOptional({ 
    example: 'All documents submitted', 
    description: 'Admission remarks' 
  })
  @IsString()
  @IsOptional()
  remarks?: string;
}