// src/modules/student-admission/dto/document-upload.dto.ts
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty({ enum: ['BIRTH_CERTIFICATE', 'ID_PROOF', 'TRANSFER_CERTIFICATE', 'MEDICAL_CERTIFICATE', 'PHOTOGRAPH', 'MARKSHEET', 'GUARDIAN_ID', 'OTHER'] })
  @IsEnum(['BIRTH_CERTIFICATE', 'ID_PROOF', 'TRANSFER_CERTIFICATE', 'MEDICAL_CERTIFICATE', 'PHOTOGRAPH', 'MARKSHEET', 'GUARDIAN_ID', 'OTHER'])
  documentType: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsString()
  fileSize: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  verificationNotes?: string;
}