import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Register new student',
    description: 'Create a new student admission record with user account. Auto-generates student ID and validates class capacity.',
  })
  @ApiResponse({
    status: 201,
    description: 'Student registered successfully',
    schema: {
      example: {
        message: 'Student registered successfully',
        student: {
          id: 1,
          studentId: 'STU2024001',
          admissionNumber: 'ADM2024001',
          firstName: 'John',
          lastName: 'Doe',
          class: {
            id: 1,
            name: 'Grade 10-A',
          },
          user: {
            id: 5,
            username: 'john_student',
            email: 'john.student@school.edu',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed' })
  @ApiResponse({ status: 409, description: 'Conflict - Duplicate admission number/email/username' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all students (Paginated)',
    description: 'Retrieve paginated list of students with advanced filtering options',
  })
  @ApiResponse({
    status: 200,
    description: 'Students retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            studentId: 'STU2024001',
            admissionNumber: 'ADM2024001',
            firstName: 'John',
            lastName: 'Doe',
            class: {
              name: 'Grade 10-A',
              grade: 10,
              section: 'A',
            },
          },
        ],
        meta: {
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
        },
      },
    },
  })
  findAll(@Query() query: QueryStudentDto) {
    return this.studentsService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get student statistics',
    description: 'Retrieve statistical data about students (total, active, gender distribution, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStatistics() {
    return this.studentsService.getStatistics();
  }

  @Get('student-id/:studentId')
  @ApiOperation({
    summary: 'Get student by Student ID',
    description: 'Retrieve student details using student ID (e.g., STU2024001)',
  })
  @ApiResponse({
    status: 200,
    description: 'Student found',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findByStudentId(@Param('studentId') studentId: string) {
    return this.studentsService.findByStudentId(studentId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get student by ID',
    description: 'Retrieve complete student details including attendance and exam results',
  })
  @ApiResponse({
    status: 200,
    description: 'Student details retrieved successfully',
    schema: {
      example: {
        data: {
          id: 1,
          studentId: 'STU2024001',
          admissionNumber: 'ADM2024001',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2010-05-15',
          gender: 'Male',
          class: {
            name: 'Grade 10-A',
            grade: 10,
            section: 'A',
          },
          guardianName: 'Michael Doe',
          guardianPhone: '+251911111111',
          status: 'Active',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update student information',
    description: 'Update student personal, contact, guardian, and academic information',
  })
  @ApiResponse({
    status: 200,
    description: 'Student updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Duplicate email' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deactivate student',
    description: 'Soft delete - deactivates student and their user account. Updates class strength.',
  })
  @ApiResponse({
    status: 200,
    description: 'Student deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}