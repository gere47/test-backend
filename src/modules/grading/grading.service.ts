
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ForbiddenException,
  ConflictException 
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

// Define constants locally
const EXAM_STATUS = {
  SCHEDULED: 'SCHEDULED',
  ONGOING: 'ONGOING', 
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  POSTPONED: 'POSTPONED',
};

const DEFAULT_GRADE_SCALE = [
  { grade: 'A+', minPercent: 90, maxPercent: 100, gradePoint: 4.0 },
  { grade: 'A', minPercent: 80, maxPercent: 89, gradePoint: 3.7 },
  { grade: 'B+', minPercent: 70, maxPercent: 79, gradePoint: 3.3 },
  { grade: 'B', minPercent: 60, maxPercent: 69, gradePoint: 3.0 },
  { grade: 'C+', minPercent: 50, maxPercent: 59, gradePoint: 2.7 },
  { grade: 'C', minPercent: 40, maxPercent: 49, gradePoint: 2.3 },
  { grade: 'D', minPercent: 33, maxPercent: 39, gradePoint: 2.0 },
  { grade: 'F', minPercent: 0, maxPercent: 32, gradePoint: 0.0 },
];

@Injectable()
export class GradingService {
  constructor(private prisma: PrismaService) {}

  // ========== BASIC GRADE MANAGEMENT ========== //

  async createGrade(createGradeDto: any, enteredById: number) {
    const { studentId, examId, subjectId, marksObtained, maxMarks, remarks } = createGradeDto;

    await this.validateStudentExists(studentId);
    await this.getExamById(examId);
    await this.validateSubjectExists(subjectId);

    if (marksObtained > maxMarks) {
      throw new BadRequestException('Marks obtained cannot exceed maximum marks');
    }

    const existingGrade = await this.prisma.examResult.findFirst({
      where: { studentId, examId, subjectId },
    });

    if (existingGrade) {
      throw new ConflictException('Grade already exists for this student, exam, and subject');
    }

    const percentage = (marksObtained / maxMarks) * 100;
    const grade = await this.calculateGrade(percentage);

    return this.prisma.examResult.create({
      data: {
        studentId,
        examId,
        subjectId,
        theoryMarks: marksObtained,
        totalMarks: marksObtained,
        maxMarks,
        percentage,
        grade: grade,
        isAbsent: false,
        enteredBy: enteredById,
        isVerified: false,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
        exam: true,
        subject: true,
      },
    });
  }

  async createBulkGrades(bulkGradesDto: any, enteredById: number) {
    const { examId, records } = bulkGradesDto;

    await this.getExamById(examId);
    const results = [];
    const errors = [];

    for (const record of records) {
      try {
        if (record.marksObtained > record.maxMarks) {
          errors.push({ studentId: record.studentId, error: 'Marks exceed maximum' });
          continue;
        }

        const existingGrade = await this.prisma.examResult.findFirst({
          where: { 
            studentId: record.studentId, 
            examId, 
            subjectId: record.subjectId 
          },
        });

        if (existingGrade) {
          errors.push({ studentId: record.studentId, error: 'Grade already exists' });
          continue;
        }

        await this.validateStudentExists(record.studentId);
        await this.validateSubjectExists(record.subjectId);

        const percentage = (record.marksObtained / record.maxMarks) * 100;
        const grade = await this.calculateGrade(percentage);

        const createdGrade = await this.prisma.examResult.create({
          data: {
            studentId: record.studentId,
            examId,
            subjectId: record.subjectId,
            theoryMarks: record.marksObtained,
            totalMarks: record.marksObtained,
            maxMarks: record.maxMarks,
            percentage,
            grade: record.grade || grade,
            isAbsent: false,
            enteredBy: enteredById,
            isVerified: false,
          },
        });

        results.push(createdGrade);
      } catch (error) {
        errors.push({ studentId: record.studentId, error: error.message });
      }
    }

    return {
      success: results,
      errors,
      summary: {
        total: records.length,
        successful: results.length,
        failed: errors.length,
      },
    };
  }

  // ========== EXAM MANAGEMENT ========== //

  async createExam(createExamDto: any, userId: number) {
    const { subjects, ...examData } = createExamDto;

    return await this.prisma.$transaction(async (tx) => {
      await this.validateExamData(examData, tx);

      const exam = await tx.exam.create({
        data: {
          ...examData,
          startDate: new Date(examData.startDate),
          endDate: new Date(examData.endDate),
          createdBy: userId,
        },
      });

      if (subjects && subjects.length > 0) {
        await tx.examSubject.createMany({
          data: subjects.map(subject => ({
            ...subject,
            examId: exam.id,
            examDate: new Date(subject.examDate),
            maxMarks: subject.maxMarks,
            minMarks: subject.minMarks,
            practicalMarks: subject.practicalMarks || null,
            theoryMarks: subject.theoryMarks || null,
          })),
        });
      }

      return this.getExamWithDetails(exam.id);
    });
  }

  async findAllExams(filters: {
  classId?: number;
  academicSessionId?: number;
  term?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { classId, academicSessionId, term, status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(classId && { classId }),
    // Remove academicSessionId since it doesn't exist in your schema
    ...(term && { term }),
    // Remove status since it doesn't exist in your schema
  };

  const [exams, total] = await Promise.all([
    this.prisma.exam.findMany({
      where,
      include: {
        examType: true,
        class: true,
        // REMOVE academicSession since it doesn't exist
        examSubjects: {
          include: {
            subject: true,
          },
        },
        _count: {
          select: {
            examResults: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { startDate: 'desc' },
    }),
    this.prisma.exam.count({ where }),
  ]);

  return {
    exams,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}


  async findExamById(id: number) {
    const exam = await this.getExamWithDetails(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async updateExam(id: number, updateExamDto: any, userId: number) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.isPublished) {
      throw new ForbiddenException('Cannot update published exam');
    }

    const updateData: any = { ...updateExamDto };
    
    // Remove properties that don't exist in Exam model
    delete updateData.academicSession; // This is a relation, not a direct field
    delete updateData.reportCard; // This is a relation, not a direct field
    
    if (updateExamDto.startDate) {
      updateData.startDate = new Date(updateExamDto.startDate);
    }
    if (updateExamDto.endDate) {
      updateData.endDate = new Date(updateExamDto.endDate);
    }

    // FIXED: Only include valid status values
    if (updateExamDto.status && !Object.values(EXAM_STATUS).includes(updateExamDto.status)) {
      throw new BadRequestException('Invalid exam status');
    }

    const updatedExam = await this.prisma.exam.update({
      where: { id },
      data: updateData,
    });

    return this.getExamWithDetails(updatedExam.id);
  }

  async publishExam(id: number, userId: number) {
  const exam = await this.prisma.exam.findUnique({ where: { id } });
  if (!exam) {
    throw new NotFoundException('Exam not found');
  }

  const subjectsCount = await this.prisma.examSubject.count({
    where: { examId: id },
  });

  if (subjectsCount === 0) {
    throw new BadRequestException('Cannot publish exam without subjects');
  }

  return this.prisma.exam.update({
    where: { id },
    data: {
      isPublished: true,
      // REMOVE status since it doesn't exist
    },
  });
}
  // ========== EXAM RESULTS MANAGEMENT ========== //

  async enterBulkResults(bulkResultsDto: any, userId: number) {
    const { examId, results } = bulkResultsDto;

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { examSubjects: true },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (!exam.isPublished) {
      throw new ForbiddenException('Cannot enter results for unpublished exam');
    }

    return await this.prisma.$transaction(async (tx) => {
      const createdResults = [];

      for (const result of results) {
        const subjectInExam = exam.examSubjects.find(
          es => es.subjectId === result.subjectId
        );

        if (!subjectInExam) {
          throw new BadRequestException(
            `Subject ID ${result.subjectId} not found in exam`
          );
        }

        if (!result.isAbsent) {
          const maxMarks = subjectInExam.maxMarks;
          const theoryMarks = result.theoryMarks || 0;
          const practicalMarks = result.practicalMarks || 0;
          const totalMarks = theoryMarks + practicalMarks;

          if (totalMarks > maxMarks) {
            throw new BadRequestException(
              `Total marks (${totalMarks}) exceed maximum marks (${maxMarks}) for student ${result.studentId}`
            );
          }

          const percentage = (totalMarks / maxMarks) * 100;
          const grade = await this.calculateGrade(percentage);

          const examResult = await tx.examResult.upsert({
            where: {
              examId_studentId_subjectId: {
                examId,
                studentId: result.studentId,
                subjectId: result.subjectId,
              },
            },
            update: {
              theoryMarks,
              practicalMarks,
              totalMarks,
              maxMarks,
              percentage,
              grade,
              isAbsent: result.isAbsent || false,
              remarks: result.remarks,
              enteredBy: userId,
            },
            create: {
              examId,
              studentId: result.studentId,
              subjectId: result.subjectId,
              theoryMarks,
              practicalMarks,
              totalMarks,
              maxMarks,
              percentage,
              grade,
              isAbsent: result.isAbsent || false,
              remarks: result.remarks,
              enteredBy: userId,
            },
          });

          createdResults.push(examResult);
        } else {
          const examResult = await tx.examResult.upsert({
            where: {
              examId_studentId_subjectId: {
                examId,
                studentId: result.studentId,
                subjectId: result.subjectId,
              },
            },
            update: {
              theoryMarks: null,
              practicalMarks: null,
              totalMarks: 0,
              maxMarks: subjectInExam.maxMarks,
              percentage: 0,
              grade: 'F',
              isAbsent: true,
              remarks: result.remarks || 'Absent',
              enteredBy: userId,
            },
            create: {
              examId,
              studentId: result.studentId,
              subjectId: result.subjectId,
              theoryMarks: null,
              practicalMarks: null,
              totalMarks: 0,
              maxMarks: subjectInExam.maxMarks,
              percentage: 0,
              grade: 'F',
              isAbsent: true,
              remarks: result.remarks || 'Absent',
              enteredBy: userId,
            },
          });

          createdResults.push(examResult);
        }
      }

      return createdResults;
    });
  }

  async verifyResults(examId: number, studentId: number, userId: number) {
    const results = await this.prisma.examResult.findMany({
      where: { examId, studentId },
    });

    if (results.length === 0) {
      throw new NotFoundException('No results found for verification');
    }

    return await this.prisma.examResult.updateMany({
      where: { examId, studentId },
      data: {
        isVerified: true,
        verifiedBy: userId,
      },
    });
  }

//   async generateReportCards(examId: number) {
//   const exam = await this.prisma.exam.findUnique({
//     where: { id: examId },
//     include: {
//       class: true,
//       // REMOVE academicSession since it doesn't exist
//     },
//   });

//   if (!exam) {
//     throw new NotFoundException('Exam not found');
//   }

//   const students = await this.prisma.student.findMany({
//     where: { classId: exam.classId },
//     include: {
//       examResults: {
//         where: { examId },
//         include: { subject: true },
//       },
//     },
//   });

//   const reportCards = [];

//   for (const student of students) {
//     const results = student.examResults;
    
//     if (results.length === 0) continue;

//     const totalMarks = results.reduce((sum, result) => 
//       sum + Number(result.totalMarks), 0
//     );
//     const maxTotalMarks = results.reduce((sum, result) => 
//       sum + result.maxMarks, 0
//     );
//     const percentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;
//     const finalGrade = await this.calculateGrade(percentage);

//     const rank = 1;

//     // FIX: Use correct property names that exist in your schema
// const reportCard = await this.prisma.reportCards.upsert({
//             where: {
//         studentId_examId: {
//           studentId: student.id,
//           examId,
//         },
//       },
//       update: {
//         totalMarks: maxTotalMarks,
//         obtainedMarks: totalMarks,
//         percentage,
//         finalGrade,
//         rank,
//         classId: exam.classId,
//         // REMOVE academicSessionId since it doesn't exist in exam object
//       },
//       create: {
//         studentId: student.id,
//         examId,
//         classId: exam.classId,
//         // REMOVE academicSessionId since it doesn't exist
//         totalMarks: maxTotalMarks,
//         obtainedMarks: totalMarks,
//         percentage,
//         finalGrade,
//         rank,
//       },
//     });

//     reportCards.push(reportCard);
//   }

//   // REMOVE this update since status doesn't exist
//   // await this.prisma.exam.update({
//   //   where: { id: examId },
//   //   data: { status: 'COMPLETED' },
//   // });

//   return reportCards;
// }

async generateReportCards(examId: number) {
  const exam = await this.prisma.exam.findUnique({
    where: { id: examId },
    include: {
      class: true,
    },
  });

  if (!exam) {
    throw new NotFoundException('Exam not found');
  }

  const students = await this.prisma.student.findMany({
    where: { classId: exam.classId },
    include: {
      examResults: {
        where: { examId },
        include: { subject: true },
      },
    },
  });

  const reportCards = [];

  for (const student of students) {
    const results = student.examResults;
    
    if (results.length === 0) continue;

    const totalMarks = results.reduce((sum, result) => 
      sum + Number(result.totalMarks), 0
    );
    const maxTotalMarks = results.reduce((sum, result) => 
      sum + result.maxMarks, 0
    );
    const percentage = maxTotalMarks > 0 ? (totalMarks / maxTotalMarks) * 100 : 0;
    const finalGrade = await this.calculateGrade(percentage);

    const rank = 1;

    // Create report card data without saving to database
    const reportData = {
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      examId,
      examName: exam.name,
      classId: exam.classId,
      totalMarks: maxTotalMarks,
      obtainedMarks: totalMarks,
      percentage,
      finalGrade,
      rank,
      calculatedAt: new Date()
    };

    reportCards.push(reportData);
  }

  return reportCards;
}
  // ========== GRADE SCALE MANAGEMENT ========== //

  async initializeGradeScale() {
    const existingScales = await this.prisma.gradeScale.count();
    
    if (existingScales === 0) {
      return await this.prisma.gradeScale.createMany({
        data: DEFAULT_GRADE_SCALE,
      });
    }

    return { message: 'Grade scale already initialized' };
  }

  async getGradeScales() {
    return this.prisma.gradeScale.findMany({
      where: { isActive: true },
      orderBy: { minPercent: 'desc' },
    });
  }

  async createGradeScale(createGradeScaleDto: any) {
    const { minPercent, maxPercent, gradePoint, ...data } = createGradeScaleDto;

    const overlappingScale = await this.prisma.gradeScale.findFirst({
      where: {
        OR: [
          {
            minPercent: { lte: maxPercent },
            maxPercent: { gte: minPercent },
          },
        ],
        isActive: true,
      },
    });

    if (overlappingScale) {
      throw new ConflictException('Grade scale range overlaps with existing scale');
    }

    return this.prisma.gradeScale.create({
      data: {
        ...data,
        minPercent: minPercent,
        maxPercent: maxPercent,
        gradePoint: gradePoint,
      },
    });
  }

  // ========== ANALYTICS & REPORTS ========== //

  async getExamStatistics(examId: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        class: true,
        examResults: {
          include: {
            student: true,
            subject: true,
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const results = exam.examResults;
    const totalStudents = await this.prisma.student.count({
      where: { classId: exam.classId },
    });

    const subjectWiseStats = await this.prisma.examResult.groupBy({
      by: ['subjectId'],
      where: { examId },
      _count: { studentId: true },
      _avg: { percentage: true },
      _max: { percentage: true },
      _min: { percentage: true },
    });

    const gradeDistribution = await this.prisma.examResult.groupBy({
      by: ['grade'],
      where: { examId },
      _count: { grade: true },
    });

    return {
      exam: {
        id: exam.id,
        name: exam.name,
        totalStudents,
        studentsWithResults: results.length,
      },
      subjectWiseStats,
      gradeDistribution,
      overall: {
        averagePercentage: results.length > 0 ? 
          results.reduce((sum, r) => sum + Number(r.percentage), 0) / results.length : 0,
        passPercentage: results.length > 0 ? 
          (results.filter(r => r.grade !== 'F').length / results.length) * 100 : 0,
      },
    };
  }

  // async getStudentGrades(studentId: number, academicSessionId?: number) {
  //   const where: any = { studentId };
  //   if (academicSessionId) {
  //     where.exam = { academicSessionId };
  //   }

  //   const grades = await this.prisma.examResult.findMany({
  //     where,
  //     include: {
  //       exam: {
  //         include: {
  //           examType: true,
  //           academicSession: true, // FIXED: Include academicSession
  //         },
  //       },
  //       subject: true,
  //     },
  //     orderBy: { createdAt: 'desc' },
  //   });

  //   const totalExams = grades.length;
  //   const passedExams = grades.filter(g => Number(g.percentage) >= 40).length;
  //   const totalMarks = grades.reduce((sum, grade) => sum + Number(grade.totalMarks), 0);
  //   const totalMaxMarks = grades.reduce((sum, grade) => sum + grade.maxMarks, 0);
  //   const averagePercentage = totalExams > 0 ? grades.reduce((sum, grade) => sum + Number(grade.percentage), 0) / totalExams : 0;

  //   return {
  //     grades,
  //     performance: {
  //       totalExams,
  //       passedExams,
  //       failedExams: totalExams - passedExams,
  //       averagePercentage: Math.round(averagePercentage * 100) / 100,
  //       totalMarks,
  //       totalMaxMarks,
  //     },
  //   };
  // }

  async getStudentGrades(studentId: number, academicSessionId?: number) {
  const where: any = { studentId };
  // Remove academicSessionId completely since it doesn't exist in your schema

  const grades = await this.prisma.examResult.findMany({
    where,
    include: {
      exam: {
        include: {
          examType: true,
          // REMOVE academicSession completely - it doesn't exist in your schema
        },
      },
      subject: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalExams = grades.length;
  const passedExams = grades.filter(g => Number(g.percentage) >= 40).length;
  const totalMarks = grades.reduce((sum, grade) => sum + Number(grade.totalMarks), 0);
  const totalMaxMarks = grades.reduce((sum, grade) => sum + grade.maxMarks, 0);
  const averagePercentage = totalExams > 0 ? grades.reduce((sum, grade) => sum + Number(grade.percentage), 0) / totalExams : 0;

  return {
    grades,
    performance: {
      totalExams,
      passedExams,
      failedExams: totalExams - passedExams,
      averagePercentage: Math.round(averagePercentage * 100) / 100,
      totalMarks,
      totalMaxMarks,
    },
  };
}

  async generateReportCard(studentId: number, academicSessionId: number) {
    const grades = await this.getStudentGrades(studentId);
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: { 
        class: true,
        session: true, // FIXED: Use 'session' instead of 'academicSession'
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const finalResults = this.calculateFinalResults(grades.grades);

    return {
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        studentId: student.studentId,
        class: student.class?.name,
        session: student.session?.name, // FIXED: Use session
      },
      grades: grades.grades,
      finalResults,
      performance: grades.performance,
      generatedAt: new Date(),
    };
  }

  // ========== HELPER METHODS ========== //

  private async getExamById(examId: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  private async validateStudentExists(studentId: number) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
  }

  private async validateSubjectExists(subjectId: number) {
    const subject = await this.prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
  }

  private async validateExamData(examData: any, tx: any) {
    const [academicSession, classRecord] = await Promise.all([
      tx.academicSession.findUnique({ where: { id: examData.academicSessionId } }),
      tx.class.findUnique({ where: { id: examData.classId } }),
    ]);

    if (!academicSession) {
      throw new NotFoundException('Academic session not found');
    }
    if (!classRecord) {
      throw new NotFoundException('Class not found');
    }

    const overlappingExam = await tx.exam.findFirst({
      where: {
        classId: examData.classId,
        academicSessionId: examData.academicSessionId,
        term: examData.term,
        OR: [
          {
            startDate: { lte: new Date(examData.endDate) },
            endDate: { gte: new Date(examData.startDate) },
          },
        ],
      },
    });

    if (overlappingExam) {
      throw new ConflictException('Exam overlaps with existing exam in the same class and term');
    }
  }

 private async getExamWithDetails(id: number) {
  return this.prisma.exam.findUnique({
    where: { id },
    include: {
      examType: true,
      class: true,
      // REMOVE academicSession since it doesn't exist
      createdByUser: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
      examSubjects: {
        include: {
          subject: true,
        },
      },
      examResults: {
        include: {
          student: true,
          subject: true,
          enteredByUser: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
}
  private async calculateGrade(percentage: number): Promise<string> {
    const gradeScale = await this.prisma.gradeScale.findFirst({
      where: {
        minPercent: { lte: percentage },
        maxPercent: { gte: percentage },
        isActive: true,
      },
      orderBy: { minPercent: 'desc' },
    });

    return gradeScale ? gradeScale.grade : 'F';
  }

  private calculateFinalResults(grades: any[]) {
    const totalMarks = grades.reduce((sum, grade) => sum + grade.maxMarks, 0);
    const obtainedMarks = grades.reduce((sum, grade) => sum + Number(grade.totalMarks), 0);
    const overallPercentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    return {
      totalMarks,
      obtainedMarks,
      overallPercentage: Math.round(overallPercentage * 100) / 100,
      overallGrade: overallPercentage >= 40 ? 'PASS' : 'FAIL',
    };
  }

  // Additional compatibility methods
  async getReportCard(studentId: number) {
    // Get current academic session or use a default
    const currentSession = await this.prisma.academicSession.findFirst({
      where: { isActive: true },
      orderBy: { startDate: 'desc' },
    });

    if (!currentSession) {
      throw new NotFoundException('No active academic session found');
    }

    return this.generateReportCard(studentId, currentSession.id);
  }

  async getAcademicHistory(studentId: number) {
    return this.getStudentGrades(studentId);
  }

  async getClassPerformance(classId: number, examId?: number) {
    const where: any = {};
    if (examId) {
      where.examId = examId;
    } else {
      where.exam = { classId };
    }

    const grades = await this.prisma.examResult.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
        subject: true,
        exam: true,
      },
    });

    const totalStudents = await this.prisma.student.count({ where: { classId } });
    const studentsWithGrades = [...new Set(grades.map(g => g.studentId))].length;

    const subjectPerformance = await this.calculateSubjectPerformance(grades);

    return {
      classId,
      totalStudents,
      studentsWithGrades,
      subjectPerformance,
      grades,
    };
  }

  private async calculateSubjectPerformance(grades: any[]) {
    const subjectGroups = grades.reduce((groups, grade) => {
      const subjectId = grade.subjectId;
      if (!groups[subjectId]) {
        groups[subjectId] = {
          subject: grade.subject,
          grades: [],
          totalMarks: 0,
          maxMarks: 0,
        };
      }
      groups[subjectId].grades.push(grade);
      groups[subjectId].totalMarks += Number(grade.totalMarks);
      groups[subjectId].maxMarks += grade.maxMarks;
      return groups;
    }, {});

    return Object.values(subjectGroups).map((group: any) => ({
      subject: group.subject,
      averageMarks: group.totalMarks / group.grades.length,
      averagePercentage: (group.totalMarks / group.maxMarks) * 100,
      passedStudents: group.grades.filter((g: any) => Number(g.percentage) >= 40).length,
      totalStudents: group.grades.length,
    }));
  }
}