// import { 
//   Controller, 
//   Get, 
//   Post, 
//   Body, 
//   Patch, 
//   Param, 
//   Delete, 
//   Query,
//   UseInterceptors,
//   UploadedFiles
// } from '@nestjs/common';
// import { SimpleCreateStudentDto } from './dto/simple-create-student.dto'; // 🚨 ADD THIS IMPORT

// import { FilesInterceptor } from '@nestjs/platform-express';
// import { StudentAdmissionService } from './student-admission.service';
// import { CreateStudentDto } from './dto/create-student.dto';
// import { UpdateStudentDto } from './dto/update-student.dto';
// import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';

// @Controller('student-admission')
// export class StudentAdmissionController {
//   constructor(private readonly studentAdmissionService: StudentAdmissionService) {}
// @Post('students-simple')
// async createStudentSimple(@Body() createStudentDto: SimpleCreateStudentDto) {
//   return this.studentAdmissionService.createStudent(createStudentDto as any);
// }
//   @Post('academic-sessions')
//   createAcademicSession(@Body() createAcademicSessionDto: CreateAcademicSessionDto) {
//     return this.studentAdmissionService.createAcademicSession(createAcademicSessionDto);
//   }

//   @Get('academic-sessions')
//   getAcademicSessions(@Query('isActive') isActive?: string) {
//     const filters = isActive ? { isActive: isActive === 'true' } : undefined;
//     return this.studentAdmissionService.getAcademicSessions(filters);
//   }

//   @Patch('academic-sessions/:id')
//   updateAcademicSession(@Param('id') id: string, @Body() updateData: any) {
//     return this.studentAdmissionService.updateAcademicSession(+id, updateData);
//   }

//   @Post('students')
//   createStudent(@Body() createStudentDto: CreateStudentDto) {
//     return this.studentAdmissionService.createStudent(createStudentDto);
//   }

//   @Get('students')
//   findAll(
//     @Query('page') page: string = '1',
//     @Query('limit') limit: string = '10',
//     @Query('academicSession') academicSession?: string,
//     @Query('class') classFilter?: string,
//     @Query('status') status?: string,
//     @Query('search') search?: string
//   ) {
//     const filters = {
//       ...(academicSession && { academicSession }),
//       ...(classFilter && { class: classFilter }),
//       ...(status && { status }),
//       ...(search && { search })
//     };
//     return this.studentAdmissionService.findAll(+page, +limit, filters);
//   }

//   @Get('students/student-id/:studentId')
//   findByStudentId(@Param('studentId') studentId: string) {
//     return this.studentAdmissionService.findByStudentId(studentId);
//   }


//   @Get('students/:studentId/admission-history')
//   getAdmissionHistory(@Param('studentId') studentId: string) {
//     return this.studentAdmissionService.getAdmissionHistory(studentId);
//   }

//   @Get('students/:studentId/admission-confirmation')
//   generateAdmissionConfirmation(@Param('studentId') studentId: string) {
//     return this.studentAdmissionService.generateAdmissionConfirmation(studentId);
//   }

//   @Get('classes/:classId/students')
//   getStudentsByClass(@Param('classId') classId: string) {
//     return this.studentAdmissionService.getStudentsByClass(+classId);
//   }


  
//   @Post('students/:studentId/documents')
//   @UseInterceptors(FilesInterceptor('files'))
//   uploadStudentDocument(
//     @Param('studentId') studentId: string,
//     @UploadedFiles() files: Express.Multer.File[],
//     @Body() body: { documentType: string }
//   ) {
//     const file = files[0];
//     return this.studentAdmissionService.uploadStudentDocument(studentId, file, body.documentType);
//   }

//   @Get('students/:studentId/documents')
//   getStudentDocuments(@Param('studentId') studentId: string) {
//     return this.studentAdmissionService.getStudentDocuments(studentId);
//   }

//   @Get('statistics/admissions')
//   getAdmissionStatistics(@Query('academicSession') academicSession?: string) {
//     return this.studentAdmissionService.getAdmissionStatistics(academicSession);
//   }

//   @Get('search/students')
//   searchStudents(
//     @Query('name') name?: string,
//     @Query('studentId') studentId?: string,
//     @Query('class') classFilter?: string,
//     @Query('academicSession') academicSession?: string,
//     @Query('status') status?: string
//   ) {
//     return this.studentAdmissionService.searchStudents({
//       name,
//       studentId,
//       class: classFilter,
//       academicSession,
//       status
//     });
//   }


  
//   @Post('students/:studentId/assign-class')
//   assignStudentToClass(
//     @Param('studentId') studentId: string,
//     @Body() classConfig: { classId: number }
//   ) {
//     return this.studentAdmissionService.assignStudentToClass(studentId, classConfig);
//   }
// }

import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Query, 
  UseGuards
} from '@nestjs/common';
import { StudentAdmissionService } from './student-admission.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('student-admission')
@UseGuards(JwtAuthGuard) // Apply auth to all endpoints
export class StudentAdmissionController {
  constructor(private readonly studentAdmissionService: StudentAdmissionService) {}

  // 🚨 MAIN ENDPOINT - Create Student
  @Post('students')
  async createStudent(@Body() createStudentDto: any) {
    return this.studentAdmissionService.createStudent(createStudentDto);
  }

  // Get All Students
  @Get('students')
  async getStudents(@Query() query: any) {
    return this.studentAdmissionService.findAll();
  }

  // Get Student by ID
  @Get('students/:id')
  async getStudentById(@Param('id') id: string) {
    return this.studentAdmissionService.findByStudentId(id);
  }

  // Get Admission Statistics
  @Get('statistics/admissions')
  async getAdmissionStatistics() {
    return this.studentAdmissionService.getAdmissionStatistics();
  }

  // Other endpoints...
  @Get('academic-sessions')
  async getAcademicSessions() {
    return this.studentAdmissionService.getAcademicSessions();
  }

  @Post('academic-sessions')
  async createAcademicSession(@Body() createAcademicSessionDto: any) {
    return this.studentAdmissionService.createAcademicSession(createAcademicSessionDto);
  }
}