// src/modules/student/presentation/controllers/student-admission.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../iam/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../iam/presentation/guards/roles-guard';
import { Roles } from '../../../iam/presentation/decorators/roles.decorator';
import { UserRole } from '../../../iam/domain/enums/user-role.enum';
import { StudentAdmissionService } from '../../application/services/student-admission.service';
import { StudentAdmissionDto } from '../../application/dto/student-admission.dto';
import { GuardianInfoDto } from '../../application/dto/guardian-info.dto';
import { EducationalBackgroundDto } from '../../application/dto/educational-background.dto';

@ApiTags('Student Admission')
@ApiBearerAuth()
@Controller('students/admission')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentAdmissionController {
  constructor(private readonly studentAdmissionService: StudentAdmissionService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Admit a new student' })
  @ApiResponse({ status: 201, description: 'Student admitted successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async admitStudent(
    @Body() admissionDto: StudentAdmissionDto,
    @Request() req,
  ) {
    return this.studentAdmissionService.admitStudent(admissionDto, req.user.id);
  }

  @Get('profile/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get student profile with details' })
  @ApiResponse({ status: 200, description: 'Student profile retrieved' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentProfile(@Param('id') studentId: string) {
    return this.studentAdmissionService.getStudentProfile(studentId);
  }

  @Put('profile/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update student profile' })
  @ApiResponse({ status: 200, description: 'Student profile updated' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async updateStudentProfile(
    @Param('id') studentId: string,
    @Body() updateData: Partial<StudentAdmissionDto>,
  ) {
    return this.studentAdmissionService.updateStudentProfile(studentId, updateData);
  }

  @Post(':id/guardians')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add guardian to student' })
  @ApiResponse({ status: 201, description: 'Guardian added successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async addGuardian(
    @Param('id') studentId: string,
    @Body() guardianDto: GuardianInfoDto,
  ) {
    return this.studentAdmissionService.addGuardian(studentId, guardianDto);
  }

  @Post(':id/education')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add educational background to student' })
  @ApiResponse({ status: 201, description: 'Educational background added' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async addEducationalBackground(
    @Param('id') studentId: string,
    @Body() educationDto: EducationalBackgroundDto,
  ) {
    return this.studentAdmissionService.addEducationalBackground(studentId, educationDto);
  }

  @Get('class/:className')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Get students by class' })
  @ApiQuery({ name: 'section', required: false })
  async getStudentsByClass(
    @Param('className') className: string,
    @Query('section') section?: string,
  ) {
    return this.studentAdmissionService.getStudentsByClass(className, section);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: 'Search students' })
  @ApiQuery({ name: 'q', required: true })
  async searchStudents(@Query('q') query: string) {
    return this.studentAdmissionService.searchStudents(query);
  }
}