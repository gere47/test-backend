import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsInt()
  capacity?: number;


  @IsOptional()
  @IsInt()
  academicSessionId?: number;
}
