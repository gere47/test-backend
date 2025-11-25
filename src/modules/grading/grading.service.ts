// // import { 
// //   Injectable, 
// //   NotFoundException, 
// //   BadRequestException,
// //   InternalServerErrorException
// // } from '@nestjs/common';
// // import { PrismaService } from '../../database/prisma.service';

// // @Injectable()
// // export class GradingService {
// //   constructor(private readonly prisma: PrismaService) {}

// //   /**
// //    * FR3.1: Create exam definition
// //    */
// //   async createExam(examData: any, userId: string): Promise<any> {
// //     // Validate academic session and class
// //     await this.validateAcademicSession(examData.sessionId);
// //     await this.validateClass(examData.classId);

// //     const exam = await this.prisma.exam.create({
// //       data: {
// //         ...examData,
// //         createdBy: userId,
// //       },
// //     });

// //     return exam;
// //   }

// //   /**
// //    * FR3.2: Enter exam results for students
// //    */
// //   async enterExamResults(examId: string, results: any[], userId: string): Promise<any> {
// //     const exam = await this.prisma.exam.findUnique({
// //       where: { id: examId },
// //       include: {
// //         examSubjects: {
// //           include: {
// //             subject: true,
// //           },
// //         },
// //       },
// //     });

// //     if (!exam) {
// //       throw new NotFoundException('Exam not found');
// //     }

// //     if (exam.isPublished) {
// //       throw new BadRequestException('Cannot modify results after exam is published');
// //     }

// //     const processedResults = [];
// //     const errors = [];

// //     for (const result of results) {
// //       try {
// //         // FR3.5: Validate marks against subject maximum
// //         const examSubject = exam.examSubjects.find(es => es.subjectId === result.subjectId);
// //         if (!examSubject) {
// //           throw new BadRequestException(`Subject not found in exam`);
// //         }

// //         const maxTheoryMarks = examSubject.theoryMarks || examSubject.maxMarks;
// //         if (result.theoryMarks > maxTheoryMarks) {
// //           throw new BadRequestException(`Theory marks (${result.theoryMarks}) cannot exceed maximum marks (${maxTheoryMarks})`);
// //         }

// //         if (result.practicalMarks && examSubject.practicalMarks && result.practicalMarks > examSubject.practicalMarks) {
// //           throw new BadRequestException(`Practical marks (${result.practicalMarks}) cannot exceed maximum practical marks (${examSubject.practicalMarks})`);
// //         }

// //         // Calculate total marks and percentage
// //         const totalMarks = (result.theoryMarks || 0) + (result.practicalMarks || 0);
// //         const percentage = examSubject.maxMarks > 0 ? (totalMarks / examSubject.maxMarks) * 100 : 0;

// //         // Calculate grade
// //         const grade = await this.calculateGrade(percentage);

// //         const examResult = await this.prisma.examResult.upsert({
// //           where: {
// //             examId_studentId_subjectId: {
// //               examId,
// //               studentId: result.studentId,
// //               subjectId: result.subjectId,
// //             },
// //           },
// //           update: {
// //             theoryMarks: result.theoryMarks,
// //             practicalMarks: result.practicalMarks,
// //             totalMarks,
// //             maxMarks: examSubject.maxMarks,
// //             percentage,
// //             grade,
// //             remarks: result.remarks,
// //             isAbsent: result.isAbsent || false,
// //             enteredBy: userId,
// //           },
// //           create: {
// //             examId,
// //             studentId: result.studentId,
// //             subjectId: result.subjectId,
// //             theoryMarks: result.theoryMarks,
// //             practicalMarks: result.practicalMarks,
// //             totalMarks,
// //             maxMarks: examSubject.maxMarks,
// //             percentage,
// //             grade,
// //             remarks: result.remarks,
// //             isAbsent: result.isAbsent || false,
// //             enteredBy: userId,
// //           },
// //         });

// //         processedResults.push(examResult);
// //       } catch (error) {
// //         errors.push({
// //           studentId: result.studentId,
// //           subjectId: result.subjectId,
// //           error: error.message,
// //         });
// //       }
// //     }

// //     return { results: processedResults, errors };
// //   }

// //   /**
// //    * FR3.3: Calculate grade automatically based on percentage
// //    */
// //   private async calculateGrade(percentage: number): Promise<string> {
// //     // Get active grade scales ordered by minimum percentage
// //     const gradeScales = await this.prisma.gradeScale.findMany({
// //       where: { isActive: true },
// //       orderBy: { minPercent: 'desc' },
// //     });

// //     if (gradeScales.length === 0) {
// //       // Fallback to default grading system if no grade scales configured
// //       if (percentage >= 90) return 'A+';
// //       if (percentage >= 80) return 'A';
// //       if (percentage >= 70) return 'B+';
// //       if (percentage >= 60) return 'B';
// //       if (percentage >= 50) return 'C';
// //       if (percentage >= 40) return 'D';
// //       return 'F';
// //     }

// //     // Find the appropriate grade based on percentage
// //     for (const gradeScale of gradeScales) {
// //       if (percentage >= gradeScale.minPercent.toNumber()) {
// //         return gradeScale.grade;
// //       }
// //     }

// //     return 'F'; // Fail if below all thresholds
// //   }

// //   /**
// //    * FR3.4: Generate comprehensive report card
// //    */
// //   async generateReportCard(studentId: string, examId: string): Promise<any> {
// //     const student = await this.prisma.student.findUnique({
// //       where: { id: studentId },
// //       include: {
// //         class: true,
// //         session: true,
// //       },
// //     });

// //     if (!student) {
// //       throw new NotFoundException('Student not found');
// //     }

// //     const exam = await this.prisma.exam.findUnique({
// //       where: { id: examId },
// //       include: {
// //         examType: true,
// //         examSubjects: {
// //           include: {
// //             subject: true,
// //           },
// //         },
// //       },
// //     });

// //     if (!exam) {
// //       throw new NotFoundException('Exam not found');
// //     }

// //     // Get all results for this student in this exam
// //     const results = await this.prisma.examResult.findMany({
// //       where: {
// //         studentId,
// //         examId,
// //       },
// //     });

// //     // Get subjects separately to avoid include issues
// //     const subjects = await this.prisma.subject.findMany({
// //       where: {
// //         id: { in: results.map(r => r.subjectId) },
// //       },
// //     });

// //     // Calculate overall performance
// //     const totalMarks = results.reduce((sum, result) => sum + result.totalMarks.toNumber(), 0);
// //     const maxTotalMarks = results.reduce((sum, result) => sum + result.maxMarks, 0);
// //     const overallPercentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;
// //     const overallGrade = await this.calculateGrade(overallPercentage);

// //     // Get attendance percentage for the exam period
// //     const attendancePercentage = await this.getAttendancePercentage(studentId, exam.startDate, exam.endDate);

// //     // Calculate rank in class
// //     const rank = await this.calculateRank(studentId, examId, student.classId);

// //     const reportCard = {
// //       student: {
// //         studentId: student.studentId,
// //         name: `${student.firstName} ${student.lastName}`,
// //         class: student.class.name,
// //         section: student.class.section,
// //         rollNumber: student.rollNumber,
// //         admissionNumber: student.admissionNumber,
// //       },
// //       exam: {
// //         name: exam.name,
// //         type: exam.examType.name,
// //         term: exam.term,
// //         academicYear: exam.academicYear,
// //         startDate: exam.startDate,
// //         endDate: exam.endDate,
// //       },
// //       subjects: results.map(result => {
// //         const subject = subjects.find(s => s.id === result.subjectId);
// //         return {
// //           subjectCode: subject?.code,
// //           subjectName: subject?.name,
// //           theoryMarks: result.theoryMarks?.toNumber(),
// //           practicalMarks: result.practicalMarks?.toNumber(),
// //           totalMarks: result.totalMarks.toNumber(),
// //           maxMarks: result.maxMarks,
// //           percentage: result.percentage.toNumber(),
// //           grade: result.grade,
// //           remarks: result.remarks,
// //           isAbsent: result.isAbsent,
// //         };
// //       }),
// //       summary: {
// //         totalMarks: Math.round(totalMarks * 100) / 100,
// //         maxTotalMarks,
// //         overallPercentage: Math.round(overallPercentage * 100) / 100,
// //         overallGrade,
// //         attendancePercentage: Math.round(attendancePercentage * 100) / 100,
// //         rank,
// //         totalSubjects: results.length,
// //         passedSubjects: results.filter(r => r.grade !== 'F').length,
// //         failedSubjects: results.filter(r => r.grade === 'F').length,
// //       },
// //       generatedAt: new Date(),
// //     };

// //     return reportCard;
// //   }

// //   /**
// //    * FR3.6: Moderate marks with verification
// //    */
// //   async moderateMarks(resultId: string, moderatedMarks: any, userId: string): Promise<any> {
// //     const existingResult = await this.prisma.examResult.findUnique({
// //       where: { id: resultId },
// //     });

// //     if (!existingResult) {
// //       throw new NotFoundException('Exam result not found');
// //     }

// //     const exam = await this.prisma.exam.findUnique({
// //       where: { id: existingResult.examId },
// //       include: {
// //         examSubjects: {
// //           where: { subjectId: existingResult.subjectId },
// //         },
// //       },
// //     });

// //     if (!exam) {
// //       throw new NotFoundException('Exam not found');
// //     }

// //     if (exam.isPublished) {
// //       throw new BadRequestException('Cannot moderate marks after exam is published');
// //     }

// //     const examSubject = exam.examSubjects[0];
// //     if (!examSubject) {
// //       throw new NotFoundException('Exam subject not found');
// //     }

// //     // Validate moderated marks
// //     const maxTheoryMarks = examSubject.theoryMarks || examSubject.maxMarks;
// //     if (moderatedMarks.theoryMarks > maxTheoryMarks) {
// //       throw new BadRequestException(`Moderated theory marks cannot exceed maximum marks (${maxTheoryMarks})`);
// //     }

// //     if (moderatedMarks.practicalMarks && examSubject.practicalMarks && moderatedMarks.practicalMarks > examSubject.practicalMarks) {
// //       throw new BadRequestException(`Moderated practical marks cannot exceed maximum practical marks (${examSubject.practicalMarks})`);
// //     }

// //     // Recalculate totals
// //     const totalMarks = (moderatedMarks.theoryMarks || 0) + (moderatedMarks.practicalMarks || 0);
// //     const percentage = examSubject.maxMarks > 0 ? (totalMarks / examSubject.maxMarks) * 100 : 0;
// //     const grade = await this.calculateGrade(percentage);

// //     const updatedResult = await this.prisma.examResult.update({
// //       where: { id: resultId },
// //       data: {
// //         theoryMarks: moderatedMarks.theoryMarks,
// //         practicalMarks: moderatedMarks.practicalMarks,
// //         totalMarks,
// //         percentage,
// //         grade,
// //         verifiedBy: userId,
// //         isVerified: true,
// //       },
// //     });

// //     return updatedResult;
// //   }

// //   /**
// //    * FR3.7: Generate comprehensive performance analytics
// //    */
// //   async getPerformanceAnalytics(classId: string, examId: string): Promise<any> {
// //     const [classPerformance, subjectPerformance, topPerformers, weakPerformers] = await Promise.all([
// //       this.getClassPerformance(classId, examId),
// //       this.getSubjectPerformance(classId, examId),
// //       this.getTopPerformers(classId, examId),
// //       this.getWeakPerformers(classId, examId),
// //     ]);

// //     return {
// //       classPerformance,
// //       subjectPerformance,
// //       topPerformers,
// //       weakPerformers,
// //       generatedAt: new Date(),
// //     };
// //   }

// //   /**
// //    * FR3.8: Export report in various formats
// //    */
// //   async exportReportCard(reportCard: any, format: 'PDF' | 'EXCEL'): Promise<{ data: any; format: string }> {
// //     // In a real implementation, this would integrate with libraries like:
// //     // - PDF: pdfkit, puppeteer
// //     // - Excel: exceljs, xlsx
    
// //     // For now, return structured data that can be converted
// //     const exportData = {
// //       ...reportCard,
// //       exportFormat: format,
// //       exportedAt: new Date(),
// //     };

// //     return {
// //       data: exportData,
// //       format,
// //     };
// //   }

// //   /**
// //    * Publish exam results (make them visible to students/parents)
// //    */
// //   async publishExamResults(examId: string, userId: string): Promise<any> {
// //     const exam = await this.prisma.exam.findUnique({
// //       where: { id: examId },
// //     });

// //     if (!exam) {
// //       throw new NotFoundException('Exam not found');
// //     }

// //     // Verify that all results are entered (optional check)
// //     const totalStudents = await this.prisma.student.count({
// //       where: { classId: exam.classId, status: 'Active' },
// //     });

// //     const enteredResults = await this.prisma.examResult.groupBy({
// //       by: ['studentId'],
// //       where: { examId },
// //     });

// //     if (enteredResults.length < totalStudents) {
// //       throw new BadRequestException(`Results entered for ${enteredResults.length} out of ${totalStudents} students. Please complete all entries before publishing.`);
// //     }

// //     const updatedExam = await this.prisma.exam.update({
// //       where: { id: examId },
// //       data: {
// //         isPublished: true,
// //       },
// //       include: {
// //         examType: true,
// //         class: true,
// //       },
// //     });

// //     return updatedExam;
// //   }

// //   /**
// //    * Generate comprehensive report card for all exams
// //    */
// //   async generateComprehensiveReportCard(studentId: string): Promise<any> {
// //     const student = await this.prisma.student.findUnique({
// //       where: { id: studentId },
// //       include: {
// //         class: true,
// //         session: true,
// //       },
// //     });

// //     if (!student) {
// //       throw new NotFoundException('Student not found');
// //     }

// //     // Get all exam results for the student
// //     const results = await this.prisma.examResult.findMany({
// //       where: { studentId },
// //       include: {
// //         exam: {
// //           include: {
// //             examType: true,
// //           },
// //         },
// //         subject: true,
// //       },
// //       orderBy: {
// //         exam: {
// //           startDate: 'desc',
// //         },
// //       },
// //     });

// //     return {
// //       student: {
// //         studentId: student.studentId,
// //         name: `${student.firstName} ${student.lastName}`,
// //         class: student.class.name,
// //         section: student.class.section,
// //       },
// //       academicHistory: results,
// //       summary: this.calculateAcademicSummary(results),
// //     };
// //   }

// //   /**
// //    * Get complete academic history for a student
// //    */
// //   async getStudentAcademicHistory(studentId: string): Promise<any> {
// //     const results = await this.prisma.examResult.findMany({
// //       where: { studentId },
// //       include: {
// //         exam: {
// //           include: {
// //             examType: true,
// //           },
// //         },
// //         subject: true,
// //       },
// //       orderBy: {
// //         exam: {
// //           startDate: 'desc',
// //         },
// //       },
// //     });

// //     return {
// //       studentId,
// //       academicRecords: results,
// //       performanceTrend: this.calculatePerformanceTrend(results),
// //     };
// //   }

// //   /**
// //    * Get overall class performance across all exams
// //    */
// //   async getClassOverallPerformance(classId: string): Promise<any> {
// //     const results = await this.prisma.examResult.findMany({
// //       where: {
// //         student: { classId },
// //       },
// //       include: {
// //         student: {
// //           select: {
// //             id: true,
// //             studentId: true,
// //             firstName: true,
// //             lastName: true,
// //           },
// //         },
// //         subject: true,
// //         exam: true,
// //       },
// //     });

// //     // Calculate various performance metrics
// //     return this.calculateClassPerformanceMetrics(results, classId);
// //   }

// //   /**
// //    * Get subject-wise performance analytics (PUBLIC VERSION)
// //    */
// //   async getSubjectPerformancePublic(subjectId: string, classId?: string): Promise<any> {
// //     return this.getSubjectPerformance(subjectId, classId);
// //   }

// //   // ============ PRIVATE HELPER METHODS ============

// //   private async validateAcademicSession(sessionId: string): Promise<void> {
// //     const session = await this.prisma.academicSession.findUnique({
// //       where: { id: sessionId },
// //     });

// //     if (!session) {
// //       throw new NotFoundException('Academic session not found');
// //     }
// //   }

// //   private async validateClass(classId: string): Promise<void> {
// //     const classInfo = await this.prisma.class.findUnique({
// //       where: { id: classId },
// //     });

// //     if (!classInfo) {
// //       throw new NotFoundException('Class not found');
// //     }
// //   }

// //   private async getAttendancePercentage(studentId: string, startDate: Date, endDate: Date): Promise<number> {
// //     const attendance = await this.prisma.attendance.groupBy({
// //       by: ['status'],
// //       where: {
// //         studentId,
// //         date: {
// //           gte: startDate,
// //           lte: endDate,
// //         },
// //       },
// //       _count: { id: true },
// //     });

// //     const presentCount = attendance.find(item => item.status === 'Present')?._count.id || 0;
// //     const totalCount = attendance.reduce((sum, item) => sum + item._count.id, 0);

// //     return totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
// //   }

// //   private async calculateRank(studentId: string, examId: string, classId: string): Promise<number> {
// //     // Get average percentage for all students in the class for this exam
// //     const studentAverages = await this.prisma.examResult.groupBy({
// //       by: ['studentId'],
// //       where: { 
// //         examId,
// //         student: { classId, status: 'Active' }
// //       },
// //       _avg: { percentage: true },
// //     });

// //     // Sort by average percentage descending
// //     const sortedAverages = studentAverages.sort((a, b) => 
// //       b._avg.percentage.toNumber() - a._avg.percentage.toNumber()
// //     );

// //     // Find the rank of the target student
// //     const rank = sortedAverages.findIndex(avg => avg.studentId === studentId) + 1;
// //     return rank;
// //   }

// //   private async getClassPerformance(classId: string, examId: string): Promise<any> {
// //     const results = await this.prisma.examResult.findMany({
// //       where: {
// //         examId,
// //         student: { classId, status: 'Active' },
// //       },
// //     });

// //     if (results.length === 0) {
// //       return {
// //         averagePercentage: 0,
// //         highestPercentage: 0,
// //         lowestPercentage: 0,
// //         passPercentage: 0,
// //         distinctionPercentage: 0,
// //         totalStudents: 0,
// //       };
// //     }

// //     const percentages = results.map(r => r.percentage.toNumber());
// //     const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;
// //     const highest = Math.max(...percentages);
// //     const lowest = Math.min(...percentages);
    
// //     const passCount = results.filter(r => r.percentage.toNumber() >= 40).length;
// //     const distinctionCount = results.filter(r => r.percentage.toNumber() >= 75).length;

// //     return {
// //       averagePercentage: Math.round(average * 100) / 100,
// //       highestPercentage: Math.round(highest * 100) / 100,
// //       lowestPercentage: Math.round(lowest * 100) / 100,
// //       passPercentage: Math.round((passCount / results.length) * 100 * 100) / 100,
// //       distinctionPercentage: Math.round((distinctionCount / results.length) * 100 * 100) / 100,
// //       totalStudents: new Set(results.map(r => r.studentId)).size,
// //     };
// //   }

// //   private async getSubjectPerformance(classId: string, examId: string): Promise<any> {
// //     const results = await this.prisma.examResult.groupBy({
// //       by: ['subjectId'],
// //       where: {
// //         examId,
// //         student: { classId, status: 'Active' },
// //       },
// //       _avg: { percentage: true },
// //       _count: { id: true },
// //     });

// //     const subjects = await this.prisma.subject.findMany({
// //       where: {
// //         id: { in: results.map(r => r.subjectId) },
// //       },
// //     });

// //     return results.map(result => {
// //       const subject = subjects.find(s => s.id === result.subjectId);
// //       const passCount = result._count.id; // This would need to be calculated properly
      
// //       return {
// //         subjectCode: subject?.code,
// //         subjectName: subject?.name,
// //         averagePercentage: Math.round(result._avg.percentage.toNumber() * 100) / 100,
// //         totalStudents: result._count.id,
// //         passRate: Math.round((result._count.id / result._count.id) * 100 * 100) / 100, // Simplified
// //       };
// //     });
// //   }

// //   private async getTopPerformers(classId: string, examId: string): Promise<any> {
// //     const results = await this.prisma.examResult.groupBy({
// //       by: ['studentId'],
// //       where: {
// //         examId,
// //         student: { classId, status: 'Active' },
// //       },
// //       _avg: { percentage: true },
// //     });

// //     const sortedResults = results.sort((a, b) => b._avg.percentage.toNumber() - a._avg.percentage.toNumber());
// //     const top10 = sortedResults.slice(0, 10);

// //     const students = await this.prisma.student.findMany({
// //       where: {
// //         id: { in: top10.map(r => r.studentId) },
// //       },
// //     });

// //     return top10.map((result, index) => {
// //       const student = students.find(s => s.id === result.studentId);
// //       return {
// //         rank: index + 1,
// //         studentId: student?.studentId,
// //         name: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
// //         percentage: Math.round(result._avg.percentage.toNumber() * 100) / 100,
// //         rollNumber: student?.rollNumber,
// //       };
// //     });
// //   }

// //   private async getWeakPerformers(classId: string, examId: string): Promise<any> {
// //     const results = await this.prisma.examResult.groupBy({
// //       by: ['studentId'],
// //       where: {
// //         examId,
// //         student: { classId, status: 'Active' },
// //       },
// //       _avg: { percentage: true },
// //     });

// //     // Filter students with average below 40%
// //     const weakStudents = results.filter(result => result._avg.percentage.toNumber() < 40);
// //     const sortedWeakStudents = weakStudents.sort((a, b) => a._avg.percentage.toNumber() - b._avg.percentage.toNumber());

// //     const students = await this.prisma.student.findMany({
// //       where: {
// //         id: { in: sortedWeakStudents.map(r => r.studentId) },
// //       },
// //     });

// //     return sortedWeakStudents.map((result, index) => {
// //       const student = students.find(s => s.id === result.studentId);
// //       return {
// //         rank: index + 1,
// //         studentId: student?.studentId,
// //         name: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
// //         percentage: Math.round(result._avg.percentage.toNumber() * 100) / 100,
// //         rollNumber: student?.rollNumber,
// //         needsAttention: true,
// //       };
// //     });
// //   }

// //   /**
// //    * Calculate academic summary from results
// //    */
// //   private calculateAcademicSummary(results: any[]): any {
// //     if (results.length === 0) {
// //       return {
// //         totalExams: 0,
// //         subjectsCount: 0,
// //         averagePercentage: 0,
// //         bestSubject: 'N/A',
// //         improvement: 0,
// //       };
// //     }

// //     const totalExams = new Set(results.map(r => r.examId)).size;
// //     const averagePercentage = results.reduce((sum, r) => sum + r.percentage.toNumber(), 0) / results.length;
// //     const subjects = new Set(results.map(r => r.subjectId)).size;

// //     return {
// //       totalExams,
// //       subjectsCount: subjects,
// //       averagePercentage: Math.round(averagePercentage * 100) / 100,
// //       bestSubject: this.findBestSubject(results),
// //       improvement: this.calculateImprovement(results),
// //     };
// //   }

// //   /**
// //    * Calculate performance trend over time
// //    */
// //   private calculatePerformanceTrend(results: any[]): any {
// //     if (results.length === 0) {
// //       return {};
// //     }

// //     // Group by exam and calculate trends
// //     const examPerformance = results.reduce((acc, result) => {
// //       const examName = result.exam.name;
// //       if (!acc[examName]) {
// //         acc[examName] = [];
// //       }
// //       acc[examName].push(result.percentage.toNumber());
// //       return acc;
// //     }, {});

// //     return examPerformance;
// //   }

// //   /**
// //    * Calculate class performance metrics
// //    */
// //   private calculateClassPerformanceMetrics(results: any[], classId: string): any {
// //     if (results.length === 0) {
// //       return {
// //         classId,
// //         totalStudents: 0,
// //         performanceRanking: [],
// //         classAverage: 0,
// //       };
// //     }

// //     const studentPerformance = results.reduce((acc, result) => {
// //       const studentId = result.studentId;
// //       if (!acc[studentId]) {
// //         acc[studentId] = {
// //           student: result.student,
// //           totalMarks: 0,
// //           examCount: 0,
// //           subjects: new Set(),
// //         };
// //       }
// //       acc[studentId].totalMarks += result.percentage.toNumber();
// //       acc[studentId].examCount++;
// //       acc[studentId].subjects.add(result.subjectId);
// //       return acc;
// //     }, {});

// //     // Convert to array and calculate rankings
// //     const performanceArray = Object.values(studentPerformance).map((student: any) => ({
// //       ...student,
// //       averagePercentage: student.totalMarks / student.examCount,
// //       subjectsCount: student.subjects.size,
// //     }));

// //     // Sort by average percentage
// //     performanceArray.sort((a: any, b: any) => b.averagePercentage - a.averagePercentage);

// //     return {
// //       classId,
// //       totalStudents: performanceArray.length,
// //       performanceRanking: performanceArray.map((student: any, index) => ({
// //         rank: index + 1,
// //         ...student,
// //         averagePercentage: Math.round(student.averagePercentage * 100) / 100,
// //       })),
// //       classAverage: Math.round(
// //         performanceArray.reduce((sum: number, student: any) => sum + student.averagePercentage, 0) / performanceArray.length * 100
// //       ) / 100,
// //     };
// //   }

// //   /**
// //    * Calculate subject performance metrics
// //    */
// //   private calculateSubjectPerformanceMetrics(results: any[], subjectId: string): any {
// //     if (results.length === 0) {
// //       return {
// //         subjectId,
// //         totalAttempts: 0,
// //         averagePercentage: 0,
// //         highestPercentage: 0,
// //         lowestPercentage: 0,
// //         performanceDistribution: {},
// //       };
// //     }

// //     const subjectResults = results.filter(r => r.subjectId === subjectId);
// //     const averageMarks = subjectResults.reduce((sum, r) => sum + r.percentage.toNumber(), 0) / subjectResults.length;
// //     const highestMarks = Math.max(...subjectResults.map(r => r.percentage.toNumber()));
// //     const lowestMarks = Math.min(...subjectResults.map(r => r.percentage.toNumber()));

// //     return {
// //       subjectId,
// //       totalAttempts: subjectResults.length,
// //       averagePercentage: Math.round(averageMarks * 100) / 100,
// //       highestPercentage: Math.round(highestMarks * 100) / 100,
// //       lowestPercentage: Math.round(lowestMarks * 100) / 100,
// //       performanceDistribution: this.calculateDistribution(subjectResults),
// //     };
// //   }

// //   /**
// //    * Find the student's best performing subject
// //    */
// //   private findBestSubject(results: any[]): string {
// //     if (results.length === 0) return 'N/A';

// //     const subjectAverages = results.reduce((acc, result) => {
// //       const subjectName = result.subject.name;
// //       if (!acc[subjectName]) {
// //         acc[subjectName] = { total: 0, count: 0 };
// //       }
// //       acc[subjectName].total += result.percentage.toNumber();
// //       acc[subjectName].count++;
// //       return acc;
// //     }, {});

// //     let bestSubject = '';
// //     let highestAverage = 0;

// //     for (const [subject, data] of Object.entries(subjectAverages)) {
// //       const average = (data as any).total / (data as any).count;
// //       if (average > highestAverage) {
// //         highestAverage = average;
// //         bestSubject = subject;
// //       }
// //     }

// //     return bestSubject;
// //   }

// //   /**
// //    * Calculate academic improvement over time
// //    */
// //   private calculateImprovement(results: any[]): number {
// //     if (results.length < 2) return 0;

// //     const sortedResults = results.sort((a, b) => 
// //       new Date(a.exam.startDate).getTime() - new Date(b.exam.startDate).getTime()
// //     );

// //     const firstExamResults = sortedResults.filter(r => r.examId === sortedResults[0].examId);
// //     const lastExamResults = sortedResults.filter(r => r.examId === sortedResults[sortedResults.length - 1].examId);

// //     if (firstExamResults.length === 0 || lastExamResults.length === 0) return 0;

// //     const firstExamAvg = firstExamResults.reduce((sum, r) => sum + r.percentage.toNumber(), 0) / firstExamResults.length;
// //     const lastExamAvg = lastExamResults.reduce((sum, r) => sum + r.percentage.toNumber(), 0) / lastExamResults.length;

// //     return Math.round((lastExamAvg - firstExamAvg) * 100) / 100;
// //   }

// //   /**
// //    * Calculate performance distribution across grade ranges
// //    */
// //   private calculateDistribution(results: any[]): any {
// //     const ranges = {
// //       '90-100': 0,
// //       '80-89': 0,
// //       '70-79': 0,
// //       '60-69': 0,
// //       '50-59': 0,
// //       'Below 50': 0,
// //     };

// //     results.forEach(result => {
// //       const percentage = result.percentage.toNumber();
// //       if (percentage >= 90) ranges['90-100']++;
// //       else if (percentage >= 80) ranges['80-89']++;
// //       else if (percentage >= 70) ranges['70-79']++;
// //       else if (percentage >= 60) ranges['60-69']++;
// //       else if (percentage >= 50) ranges['50-59']++;
// //       else ranges['Below 50']++;
// //     });

// //     return ranges;
// //   }
// // }

// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class GradingService {
//   // ... your existing methods ...

//   // Add these missing methods:
//   async generateComprehensiveReportCard(studentId: string) {
//     // Implement comprehensive report card generation
//     // This should include all subjects, grades, attendance, comments, etc.
//     return {
//       studentId,
//       reportDate: new Date(),
//       // Add your report card data structure here
//     };
//   }

//   async getClassOverallPerformance(classId: string) {
//     // Implement class performance analysis
//     // Calculate averages, statistics, etc. for the entire class
//     return {
//       classId,
//       averageGrade: 0,
//       topPerformer: null,
//       // Add class performance data
//     };
//   }

//   async getStudentAcademicHistory(studentId: string) {
//     // Implement student academic history retrieval
//     // This should include all historical grades, trends, etc.
//     return {
//       studentId,
//       academicHistory: [],
//       // Add academic history data
//     };
//   }

//   // Make this method public or create a public wrapper
//   public getSubjectPerformance(subjectId: string, classId: string) {
//     // If you have a private method with this name, make it public
//     // or implement the logic here
//     return {
//       subjectId,
//       classId,
//       averageScore: 0,
//       performanceData: [],
//     };
//   }

//   // If you have a private method that needs to remain private,
//   // create a public wrapper instead:
//   private calculateSubjectPerformance(subjectId: string, classId: string) {
//     // Your existing private implementation
//   }

//   public getSubjectPerformance(subjectId: string, classId: string) {
//     return this.calculateSubjectPerformance(subjectId, classId);
//   }
// }

import { Injectable } from '@nestjs/common';

@Injectable()
export class GradingService {
  
  // Add all the missing methods that the controller is trying to call:
  
  async generateComprehensiveReportCard(studentId: string) {
    // Implement your report card logic here
    console.log(`Generating report card for student: ${studentId}`);
    return {
      studentId,
      generatedAt: new Date(),
      subjects: [],
      overallGrade: 'N/A',
      attendance: {},
      // Add more report card data as needed
    };
  }

  async getClassOverallPerformance(classId: string) {
    // Implement class performance analysis
    console.log(`Getting class performance for: ${classId}`);
    return {
      classId,
      averageScore: 0,
      totalStudents: 0,
      performanceBreakdown: {},
      // Add more class performance data
    };
  }

  async getStudentAcademicHistory(studentId: string) {
    // Implement student academic history
    console.log(`Getting academic history for student: ${studentId}`);
    return {
      studentId,
      academicRecords: [],
      cumulativeGPA: 0,
      // Add more academic history data
    };
  }

  // Make this method public (remove private keyword)
  async getSubjectPerformance(subjectId: string, classId: string) {
    // Implement subject performance logic
    console.log(`Getting performance for subject: ${subjectId}, class: ${classId}`);
    return {
      subjectId,
      classId,
      averageGrade: 0,
      topPerformer: null,
      performanceTrend: [],
      // Add more subject performance data
    };
  }

  // Your existing methods below...
  // ... (keep whatever methods you already have)
}
