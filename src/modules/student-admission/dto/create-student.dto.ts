// import { 
//   IsString, 
//   IsDate, 
//   IsEmail, 
//   IsOptional, 
//   IsArray,
//   ValidateNested
// } from 'class-validator';
// import { Type } from 'class-transformer';

// class EducationalBackgroundDto {
//   @IsString()
//   institution: string;

//   @IsString()
//   qualification: string;

//   @IsOptional()
//   yearCompleted?: number;
// }

// export class CreateStudentDto {
//   @IsString()
//   firstName: string;

//   @IsString()
//   lastName: string;

//   @IsDate()
//   @Type(() => Date)
//   dateOfBirth: Date;

//   @IsString()
//   gender: string;

//   @IsString()
//   academicSession: string;

//   @IsString()
//   class: string;

//   // 🚨 OPTIONAL FIELDS - MUST HAVE @IsOptional()
//   @IsOptional()
//   @IsEmail()
//   email?: string;

//   @IsOptional()
//   @IsString()
//   phone?: string;

//   @IsOptional()
//   @IsString()
//   address?: string;

//   @IsOptional()
//   @IsString()
//   city?: string;

//   @IsOptional()
//   @IsString()
//   state?: string;

//   @IsOptional()
//   @IsString()
//   zipCode?: string;

//   @IsOptional()
//   @IsString()
//   nationalId?: string;

//   @IsOptional()
//   @IsString()
//   guardianName?: string;

//   @IsOptional()
//   @IsString()
//   guardianRelationship?: string;

//   @IsOptional()
//   @IsEmail()
//   guardianEmail?: string;

//   @IsOptional()
//   @IsString()
//   guardianPhone?: string;

//   @IsOptional()
//   @IsString()
//   guardianOccupation?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => EducationalBackgroundDto)
//   educationalBackground?: EducationalBackgroundDto[];
// }

import { IsString, IsDate, IsEmail, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsString()
  gender: string;

  @IsString()
  academicSession: string;

  @IsString()
  class: string;

  // 🚨 ALL OPTIONAL FIELDS
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsString()
  guardianRelationship?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @IsOptional()
  @IsString()
  guardianOccupation?: string;

  @IsOptional()
  @IsArray()
  educationalBackground?: any[];
}