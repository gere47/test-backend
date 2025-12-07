

import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ 
    example: 'john.doe@newschool.edu', 
    required: false 
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    example: 'John', 
    required: false 
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ 
    example: 'Doe', 
    required: false 
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ 
    example: '+1234567890', 
    required: false 
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    example: 'avatar.png', 
    required: false 
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}
