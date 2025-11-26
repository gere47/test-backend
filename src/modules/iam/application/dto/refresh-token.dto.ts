// src/modules/iam/application/dto/refresh-token.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-string-here' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}