// src/modules/users/dto/user.response.dto.ts

import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  phone?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({
    example: {
      id: 2,
      name: 'teacher',
      description: 'Teacher role',
    }
  })
  role: {
    id: number;
    name: string;
    description?: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
