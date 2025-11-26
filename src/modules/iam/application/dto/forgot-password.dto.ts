import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@sophortech.edu',
    description: 'Email address to send password reset instructions'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}