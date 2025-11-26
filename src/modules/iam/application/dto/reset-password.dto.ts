import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'a1b2c3d4e5f6...',
    description: 'Password reset token received via email'
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ 
    example: 'NewSecurePassword123!',
    description: 'New password must contain uppercase, lowercase, number and special character'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  newPassword: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'Must match new password'
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}