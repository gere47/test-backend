
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UsePipes, 
  ValidationPipe,
  ParseIntPipe, 
  UseGuards
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBody 
} from '@nestjs/swagger';
import { GradingService } from './grading.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';



@ApiTags('Grading')
@UseGuards(RolesGuard,JwtAuthGuard)
@Controller('grading')
@UsePipes(new ValidationPipe({ transform: true }))
export class GradingController {
  constructor(private readonly gradingService: GradingService) {}

  // ========== EXAM MANAGEMENT ENDPOINTS ==========

  @Post('exams')
  @ApiOperation({ summary: 'Create new exam', description: 'Create a new exam with subjects and details' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createExam(@Body() createExamDto: any) {
    return this.gradingService.createExam(createExamDto, 1); // TODO: Replace with actual user ID from auth
  }

  @Get('exams')
  @ApiOperation({ summary: 'Get all exams', description: 'Retrieve all exams with optional filtering' })
  @ApiQuery({ name: 'classId', required: false, type: Number })
  @ApiQuery({ name: 'academicSessionId', required: false, type: Number })
  @ApiQuery({ name: 'term', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllExams(@Query() filters: any) {
    return this.gradingService.findAllExams(filters);
  }

  @Get('exams/:id')
  @ApiOperation({ summary: 'Get exam by ID', description: 'Retrieve detailed exam information by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findExamById(@Param('id', ParseIntPipe) id: number) {
    return this.gradingService.findExamById(id);
  }

  @Put('exams/:id')
  @ApiOperation({ summary: 'Update exam', description: 'Update exam information' })
  @ApiParam({ name: 'id', type: Number })
  async updateExam(@Param('id', ParseIntPipe) id: number, @Body() updateExamDto: any) {
    return this.gradingService.updateExam(id, updateExamDto, 1); // TODO: Replace with actual user ID
  }

  @Post('exams/:id/publish')
  @ApiOperation({ summary: 'Publish exam', description: 'Publish exam to allow results entry' })
  @ApiParam({ name: 'id', type: Number })
  async publishExam(@Param('id', ParseIntPipe) id: number) {
    return this.gradingService.publishExam(id, 1); // TODO: Replace with actual user ID
  }

  // ========== GRADE MANAGEMENT ENDPOINTS ==========

  @Post('grades')
  @ApiOperation({ summary: 'Create grade', description: 'Create individual grade entry' })
  async createGrade(@Body() createGradeDto: any) {
    return this.gradingService.createGrade(createGradeDto, 1); // TODO: Replace with actual user ID
  }

  @Post('grades/bulk')
  @ApiOperation({ summary: 'Bulk create grades', description: 'Create multiple grades in bulk' })
  async createBulkGrades(@Body() bulkGradesDto: any) {
    return this.gradingService.createBulkGrades(bulkGradesDto, 1); // TODO: Replace with actual user ID
  }

  // ========== RESULTS MANAGEMENT ENDPOINTS ==========

  @Post('results/bulk')
  @ApiOperation({ summary: 'Bulk enter results', description: 'Enter exam results in bulk for multiple students' })
  async enterBulkResults(@Body() bulkResultsDto: any) {
    return this.gradingService.enterBulkResults(bulkResultsDto, 1); // TODO: Replace with actual user ID
  }

  @Post('exams/:id/report-cards')
  @ApiOperation({ summary: 'Generate report cards', description: 'Generate report cards for all students in exam' })
  @ApiParam({ name: 'id', type: Number })
  async generateReportCards(@Param('id', ParseIntPipe) id: number) {
    return this.gradingService.generateReportCards(id);
  }

  // ========== STUDENT PERFORMANCE ENDPOINTS ==========

  @Get('students/:studentId/grades')
  @ApiOperation({ summary: 'Get student grades', description: 'Get academic history and grades for student' })
  @ApiParam({ name: 'studentId', type: Number })
  @ApiQuery({ name: 'academicSessionId', required: false, type: Number })
  async getStudentGrades(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('academicSessionId') academicSessionId?: number
  ) {
    return this.gradingService.getStudentGrades(studentId, academicSessionId);
  }

  @Get('students/:studentId/report-card')
  @ApiOperation({ summary: 'Get student report card', description: 'Generate comprehensive report card for student' })
  @ApiParam({ name: 'studentId', type: Number })
  async getReportCard(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradingService.getReportCard(studentId);
  }

  // ========== ANALYTICS & STATISTICS ENDPOINTS ==========

  @Get('exams/:id/statistics')
  @ApiOperation({ summary: 'Get exam statistics', description: 'Get detailed statistics and analytics for exam' })
  @ApiParam({ name: 'id', type: Number })
  async getExamStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.gradingService.getExamStatistics(id);
  }

  @Get('classes/:classId/performance')
  @ApiOperation({ summary: 'Get class performance', description: 'Get performance analytics for entire class' })
  @ApiParam({ name: 'classId', type: Number })
  @ApiQuery({ name: 'examId', required: false, type: Number })
  async getClassPerformance(
    @Param('classId', ParseIntPipe) classId: number,
    @Query('examId') examId?: number
  ) {
    return this.gradingService.getClassPerformance(classId, examId);
  }

  // ========== GRADE SCALE MANAGEMENT ENDPOINTS ==========

  @Get('grade-scales')
  @ApiOperation({ summary: 'Get grade scales', description: 'Get all active grade scale configurations' })
  async getGradeScales() {
    return this.gradingService.getGradeScales();
  }

  @Post('grade-scales')
  @ApiOperation({ summary: 'Create grade scale', description: 'Create custom grade scale configuration' })
  async createGradeScale(@Body() createGradeScaleDto: any) {
    return this.gradingService.createGradeScale(createGradeScaleDto);
  }

  @Post('grade-scales/initialize')
  @ApiOperation({ summary: 'Initialize grade scales', description: 'Initialize default grade scale system' })
  async initializeGradeScale() {
    return this.gradingService.initializeGradeScale();
  }
}