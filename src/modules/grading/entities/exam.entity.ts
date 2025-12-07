import { ApiProperty } from '@nestjs/swagger';

export class Exam {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  examTypeId: number;

  @ApiProperty()
  classId: number;

  @ApiProperty()
  academicSessionId: number;

  @ApiProperty()
  academicYear: string;

  @ApiProperty()
  term: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  totalWeightage?: number;

  @ApiProperty()
  passingCriteria?: string;

  @ApiProperty()
  instructions?: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ExamWithDetails extends Exam {
  @ApiProperty()
  examType: any;

  @ApiProperty()
  class: any;

  @ApiProperty()
  academicSession: any;

  @ApiProperty()
  createdByUser: any;

  @ApiProperty()
  examSubjects: any[];

  @ApiProperty()
  examResults: any[];
}