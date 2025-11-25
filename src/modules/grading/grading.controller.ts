// import { 
//   Controller, 
//   Get, 
//   Post, 
//   Body, 
//   Patch, 
//   Param, 
//   Query, 
//   UseGuards,
//   ParseUUIDPipe,
//   DefaultValuePipe,
//   ParseIntPipe
// } from '@nestjs/common';
// import { GradingService } from './grading.service';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';
// import { Roles } from '../../common/decorators/roles.decorator';
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

// enum UserRole {
//   ADMIN = 'admin',
//   TEACHER = 'teacher',
//   STUDENT = 'student',
//   REGISTRAR = 'registrar'
// }

// @ApiTags('grading')
// @ApiBearerAuth()
// @Controller('grading')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class GradingController {
//   constructor(private readonly gradingService: GradingService) {}

//   @Post('exams')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER)
//   @ApiOperation({ summary: 'Create a new exam definition' })
//   @ApiResponse({ status: 201, description: 'Exam created successfully' })
//   async createExam(
//     @Body() createExamDto: any,
//   ): Promise<any> {
//     const userId = 'system';
//     return this.gradingService.createExam(createExamDto, userId);
//   }

//   @Post('exams/:examId/results')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER)
//   @ApiOperation({ summary: 'Enter exam results for students' })
//   @ApiResponse({ status: 201, description: 'Results entered successfully' })
//   async enterExamResults(
//     @Param('examId', ParseUUIDPipe) examId: string,
//     @Body() resultsDto: any,
//   ): Promise<any> {
//     const userId = 'system';
//     return this.gradingService.enterExamResults(examId, resultsDto.results, userId);
//   }

//   @Get('report-cards/:studentId')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.REGISTRAR)
//   @ApiOperation({ summary: 'Generate report card for a student' })
//   @ApiQuery({ name: 'examId', required: false })
//   @ApiResponse({ status: 200, description: 'Report card generated' })
//   async generateReportCard(
//     @Param('studentId', ParseUUIDPipe) studentId: string,
//     @Query('examId') examId?: string,
//   ): Promise<any> {
//     if (examId) {
//       return this.gradingService.generateReportCard(studentId, examId);
//     }
//     // If no examId provided, generate for latest exam or all exams
//     return this.gradingService.generateComprehensiveReportCard(studentId);
//   }

//   @Patch('results/:resultId/moderate')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER)
//   @ApiOperation({ summary: 'Moderate exam marks' })
//   @ApiResponse({ status: 200, description: 'Marks moderated successfully' })
//   async moderateMarks(
//     @Param('resultId', ParseUUIDPipe) resultId: string,
//     @Body() moderateDto: any,
//   ): Promise<any> {
//     const userId = 'system';
//     return this.gradingService.moderateMarks(resultId, moderateDto.moderatedMarks, userId);
//   }

//   @Get('analytics/:classId')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.REGISTRAR)
//   @ApiOperation({ summary: 'Get performance analytics for a class' })
//   @ApiQuery({ name: 'examId', required: false })
//   @ApiResponse({ status: 200, description: 'Analytics retrieved' })
//   async getPerformanceAnalytics(
//     @Param('classId', ParseUUIDPipe) classId: string,
//     @Query('examId') examId?: string,
//   ): Promise<any> {
//     if (examId) {
//       return this.gradingService.getPerformanceAnalytics(classId, examId);
//     }
//     return this.gradingService.getClassOverallPerformance(classId);
//   }

//   @Post('exams/:examId/publish')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER)
//   @ApiOperation({ summary: 'Publish exam results' })
//   @ApiResponse({ status: 200, description: 'Results published successfully' })
//   async publishExamResults(
//     @Param('examId', ParseUUIDPipe) examId: string,
//   ): Promise<any> {
//     const userId = 'system';
//     return this.gradingService.publishExamResults(examId, userId);
//   }

//   @Get('student/:studentId/history')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.REGISTRAR)
//   @ApiOperation({ summary: 'Get academic history for a student' })
//   @ApiResponse({ status: 200, description: 'Academic history retrieved' })
//   async getStudentAcademicHistory(
//     @Param('studentId', ParseUUIDPipe) studentId: string,
//   ): Promise<any> {
//     return this.gradingService.getStudentAcademicHistory(studentId);
//   }

//   @Get('subjects/:subjectId/performance')
//   @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.REGISTRAR)
//   @ApiOperation({ summary: 'Get subject-wise performance analytics' })
//   @ApiResponse({ status: 200, description: 'Subject performance retrieved' })
//   async getSubjectPerformance(
//     @Param('subjectId', ParseUUIDPipe) subjectId: string,
//     @Query('classId') classId?: string,
//   ): Promise<any> {
//     return this.gradingService.getSubjectPerformance(subjectId, classId);
//   }
// }

import { Controller, Get, Param } from '@nestjs/common';
import { GradingService } from './grading.service';

@Controller('grading')
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  @Get('report-card/:studentId')
  async generateComprehensiveReportCard(@Param('studentId') studentId: string) {
    return this.gradingService.generateComprehensiveReportCard(studentId);
  }

  @Get('class-performance/:classId')
  async getClassOverallPerformance(@Param('classId') classId: string) {
    return this.gradingService.getClassOverallPerformance(classId);
  }

  @Get('academic-history/:studentId')
  async getStudentAcademicHistory(@Param('studentId') studentId: string) {
    return this.gradingService.getStudentAcademicHistory(studentId);
  }

  @Get('subject-performance/:subjectId/:classId')
  async getSubjectPerformance(
    @Param('subjectId') subjectId: string,
    @Param('classId') classId: string,
  ) {
    return this.gradingService.getSubjectPerformance(subjectId, classId);
  }
}
