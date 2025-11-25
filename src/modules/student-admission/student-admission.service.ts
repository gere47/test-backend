
import { 
  Injectable, 
  BadRequestException, 
  NotFoundException, 
  ConflictException,
  InternalServerErrorException 
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';

@Injectable()
export class StudentAdmissionService {
  constructor(private prisma: PrismaService) {}

  /**
   * FR1.1: Create and configure new academic sessions
   */
  async createAcademicSession(createAcademicSessionDto: CreateAcademicSessionDto): Promise<any> {
    try {
      // Check if session with same name already exists
      const existingSession = await this.prisma.academicSession.findFirst({
        where: { name: createAcademicSessionDto.name }
      });

      if (existingSession) {
        throw new ConflictException(`Academic session '${createAcademicSessionDto.name}' already exists`);
      }

      // Validate date range
      if (createAcademicSessionDto.startDate >= createAcademicSessionDto.endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      return await this.prisma.academicSession.create({
        data: createAcademicSessionDto
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create academic session');
    }
  }

  /**
   * FR1.1: Get all academic sessions with filtering
   */
  async getAcademicSessions(filters?: { isActive?: boolean }): Promise<any[]> {
    try {
      const where: any = {};
      
      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      return await this.prisma.academicSession.findMany({
        where,
        orderBy: { startDate: 'desc' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch academic sessions');
    }
  }

  /**
   * FR1.1: Update academic session
   */
  async updateAcademicSession(id: number, updateData: Partial<any>): Promise<any> {
    try {
      const session = await this.prisma.academicSession.findUnique({ 
        where: { id } 
      });
      
      if (!session) {
        throw new NotFoundException('Academic session not found');
      }

      // Validate date range if both dates are being updated
      if (updateData.startDate && updateData.endDate) {
        if (updateData.startDate >= updateData.endDate) {
          throw new BadRequestException('Start date must be before end date');
        }
      }

      return await this.prisma.academicSession.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update academic session');
    }
  }

  /**
   * FR1.2, FR1.3, FR1.4, FR1.5: Create student with comprehensive validation
   */
  async createStudent(createStudentDto: CreateStudentDto): Promise<any> {
    return await this.prisma.$transaction(async (tx) => {
      try {
        // FR1.5: Validate mandatory fields and business rules
        await this.validateStudentData(createStudentDto);

        // FR1.1: Validate academic session exists
        const academicSession = await tx.academicSession.findFirst({
          where: { 
            name: createStudentDto.academicSession,
            isActive: true 
          }
        });

        if (!academicSession) {
          throw new BadRequestException('Academic session not found or is inactive');
        }

        // FR1.5: Check for duplicate email, phone, and national ID
        await this.checkForDuplicateStudent(createStudentDto);

        // FR1.4: Generate unique Student ID - Convert class to number
        const studentId = await this.generateStudentId(
          createStudentDto.academicSession, 
          Number(createStudentDto.class)
        );

        // Create user first
        const user = await tx.user.create({
          data: {
            username: studentId,
            email: createStudentDto.email,
            passwordHash: 'temporary_password',
            firstName: createStudentDto.firstName,
            lastName: createStudentDto.lastName,
            phone: createStudentDto.phone,
            roleId: 4,
          }
        });

        // FR1.2, FR1.3: Create student record with personal and educational details
        const studentData: any = {
          studentId,
          userId: user.id,
          admissionNumber: studentId,
          admissionDate: new Date(),
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          dateOfBirth: createStudentDto.dateOfBirth,
          gender: createStudentDto.gender,
          email: createStudentDto.email,
          phone: createStudentDto.phone,
          address: createStudentDto.address,
          city: createStudentDto.city,
          state: createStudentDto.state,
          pincode: createStudentDto.zipCode,
          nationality: createStudentDto.nationalId,
          guardianName: createStudentDto.guardianName,
          guardianRelation: createStudentDto.guardianRelationship,
          guardianEmail: createStudentDto.guardianEmail,
          guardianPhone: createStudentDto.guardianPhone,
          guardianOccupation: createStudentDto.guardianOccupation,
          classId: Number(createStudentDto.class),
          sessionId: academicSession.id,
          status: 'Active'
        };

        const savedStudent = await tx.student.create({
          data: studentData,
          include: {
            class: {
              include: {
                session: true
              }
            }
          }
        });

        // FR1.9: Log admission activity
        await this.logAdmissionActivity(savedStudent.id.toString(), 'STUDENT_ADMITTED', {
          academicSession: await this.getAcademicSessionNameById(savedStudent.sessionId),
          class: await this.getClassnameById(savedStudent.classId),
          studentId: savedStudent.studentId
        });

        return {
          ...savedStudent,
          academicSession: await this.getAcademicSessionNameById(savedStudent.sessionId),
          class: await this.getClassnameById(savedStudent.classId)
        };

      } catch (error) {
        if (error instanceof BadRequestException || error instanceof ConflictException) {
          throw error;
        }
        throw new InternalServerErrorException('Failed to create student record');
      }
    });
  }

  /**
   * FR1.5: Comprehensive data validation
   */
  private async validateStudentData(createStudentDto: CreateStudentDto): Promise<void> {
    // Date of Birth validation (must be earlier than current date)
    if (createStudentDto.dateOfBirth >= new Date()) {
      throw new BadRequestException('Date of Birth must be earlier than current date');
    }

    // Age validation (typically 3-25 years for educational institutions)
    const age = this.calculateAge(createStudentDto.dateOfBirth);
    if (age < 3 || age > 25) {
      throw new BadRequestException('Student age must be between 3 and 25 years');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (createStudentDto.email && !emailRegex.test(createStudentDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Phone format validation (basic international format)
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    if (createStudentDto.phone && !phoneRegex.test(createStudentDto.phone)) {
      throw new BadRequestException('Invalid phone number format');
    }

    // Guardian email validation
    if (createStudentDto.guardianEmail && !emailRegex.test(createStudentDto.guardianEmail)) {
      throw new BadRequestException('Invalid guardian email format');
    }

    // National ID format validation if provided
    if (createStudentDto.nationalId) {
      const nationalIdRegex = /^[A-Za-z0-9]{8,20}$/;
      if (!nationalIdRegex.test(createStudentDto.nationalId)) {
        throw new BadRequestException('National ID must be 8-20 alphanumeric characters');
      }
    }

    // Validate mandatory fields
    const mandatoryFields = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'email', 'phone',
      'address', 'city', 'state', 'guardianName', 
      'guardianRelationship', 'guardianPhone',
      'academicSession', 'class'
    ];

    for (const field of mandatoryFields) {
      if (!createStudentDto[field as keyof CreateStudentDto]) {
        throw new BadRequestException(`Field '${field}' is mandatory`);
      }
    }
  }

  /**
   * FR1.5: Check for duplicate student records
   */
  private async checkForDuplicateStudent(createStudentDto: CreateStudentDto): Promise<void> {
    const existingStudent = await this.prisma.student.findFirst({
      where: {
        OR: [
          { email: createStudentDto.email },
          { phone: createStudentDto.phone },
          ...(createStudentDto.nationalId ? [{ nationality: createStudentDto.nationalId }] : [])
        ]
      }
    });

    if (existingStudent) {
      if (existingStudent.email === createStudentDto.email) {
        throw new ConflictException('Student with this email already exists');
      }
      if (existingStudent.phone === createStudentDto.phone) {
        throw new ConflictException('Student with this phone number already exists');
      }
      if (existingStudent.nationality === createStudentDto.nationalId) {
        throw new ConflictException('Student with this National ID already exists');
      }
    }
  }

  /**
   * FR1.4: Generate unique Student ID with pattern: YYYYCLASS001
   */
  private async generateStudentId(academicSession: string, classId: number): Promise<string> {
    try {
      const year = new Date().getFullYear();
      
      // Get class details
      const classDetails = await this.prisma.class.findUnique({
        where: { id: classId }
      });
      
      const classCode = classDetails?.name?.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 4) || 'CLS';
      
      // Get the last student in this academic session and class
      const lastStudent = await this.prisma.student.findFirst({
        where: { 
          classId: classId
        },
        orderBy: { studentId: 'desc' }
      });

      let sequence = 1;
      if (lastStudent && lastStudent.studentId) {
        const lastSequence = parseInt(lastStudent.studentId.slice(-3), 10);
        sequence = isNaN(lastSequence) ? 1 : lastSequence + 1;
      }

      return `${year}${classCode}${sequence.toString().padStart(3, '0')}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate Student ID');
    }
  }

 
  /**
   * Get all students with advanced filtering and pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      academicSession?: string;
      class?: string;
      status?: string;
      search?: string;
    }
  ): Promise<{ students: any[]; total: number; page: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (filters?.academicSession) {
        where.session = {
          name: filters.academicSession
        };
      }

      if (filters?.class) {
        where.class = {
          name: filters.class
        };
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { studentId: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      const [students, total] = await Promise.all([
        this.prisma.student.findMany({
          where,
          include: {
            class: {
              include: {
                session: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        this.prisma.student.count({ where })
      ]);

      // Enhance students with class and session names
      const enhancedStudents = await Promise.all(
        students.map(async (student) => ({
          ...student,
          academicSession: await this.getAcademicSessionNameById(student.sessionId),
          class: await this.getClassnameById(student.classId)
        }))
      );

      return {
        students: enhancedStudents,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch students');
    }
  }

  /**
   * Get student by ID with full relations
   */
  
  /**
   * Get student by Student ID
   */
  async findByStudentId(studentId: string): Promise<any> {
    try {
      const student = await this.prisma.student.findUnique({
        where: { studentId },
        include: {
          class: {
            include: {
              session: true
            }
          }
        }
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      // Enhance with names
      return {
        ...student,
        academicSession: await this.getAcademicSessionNameById(student.sessionId),
        class: await this.getClassnameById(student.classId)
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch student');
    }
  }

  /**
   * FR1.9: Get comprehensive admission history
   */
  async getAdmissionHistory(studentId: string): Promise<any> {
    try {
      const student = await this.findByStudentId(studentId);
      
      // In a real implementation, you might have a separate audit table
      const admissionLogs = await this.getStudentAuditLogs(studentId);
      
      return {
        studentId: student.studentId,
        admissionDate: student.admissionDate,
        academicSession: student.academicSession,
        class: student.class,
        status: student.status,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        admissionLogs: admissionLogs,
        totalUpdates: admissionLogs.length
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch admission history');
    }
  }

  /**
   * FR1.10: Generate printable admission confirmation
   */
  async generateAdmissionConfirmation(studentId: string): Promise<any> {
    try {
      const student = await this.findByStudentId(studentId);

      const confirmationData = {
        confirmationId: `CONF-${student.studentId}-${Date.now()}`,
        student: {
          name: `${student.firstName} ${student.lastName}`,
          studentId: student.studentId,
          class: student.class,
          academicSession: student.academicSession,
          admissionDate: student.admissionDate.toLocaleDateString(),
          dateOfBirth: student.dateOfBirth.toLocaleDateString(),
          gender: student.gender,
        },
        guardian: {
          name: student.guardianName,
          relationship: student.guardianRelation,
          phone: student.guardianPhone,
          email: student.guardianEmail,
          occupation: student.guardianOccupation,
        },
        institution: {
          name: "Your Institution Name",
          address: "Institution Address",
          phone: "Institution Phone",
          email: "Institution Email",
        },
        generatedAt: new Date().toLocaleString(),
        instructions: [
          "Please keep this confirmation slip for future reference.",
          "Report to the academic office for further formalities.",
          "Fee payment must be completed within 7 days.",
          "Bring original documents for verification during orientation.",
        ]
      };

      return confirmationData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to generate admission confirmation');
    }
  }

  /**
   * Get students by class and section for attendance integration
   */
  async getStudentsByClass(classId: number): Promise<any[]> {
    try {
      const students = await this.prisma.student.findMany({
        where: { 
          classId: classId,
          status: 'Active'
        },
        include: {
          class: true
        },
        orderBy: { firstName: 'asc' }
      });

      // Enhance with class name
      return students.map(student => ({
        ...student,
        class: student.class.name
      }));
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch students by class');
    }
  }

  /**
   * Update student status (active, inactive, graduated, transferred)
   */
  
  /**
   * FR1.6: Handle document upload and management
   */
  async uploadStudentDocument(
    studentId: string, 
    file: Express.Multer.File, 
    documentType: string
  ): Promise<any> {
    try {
      const student = await this.findByStudentId(studentId);

      // FR1.6: Validate file size (≤ 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException(`File ${file.originalname} exceeds 5MB limit`);
      }

      // Validate document type
      const allowedTypes = ['id_proof', 'transcript', 'birth_certificate', 'photo', 'transfer_certificate'];
      if (!allowedTypes.includes(documentType)) {
        throw new BadRequestException(`Invalid document type. Allowed types: ${allowedTypes.join(', ')}`);
      }

      // Create document record
      return await this.prisma.studentDocument.create({
        data: {
          documentType,
          fileName: file.originalname,
          fileUrl: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          studentId: student.id,
          uploadedBy: 1
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to upload document');
    }
  }

  /**
   * FR1.6: Get student documents
   */
  async getStudentDocuments(studentId: string): Promise<any[]> {
    try {
      const student = await this.findByStudentId(studentId);
      return await this.prisma.studentDocument.findMany({
        where: { studentId: student.id },
        orderBy: { uploadedAt: 'desc' }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch student documents');
    }
  }

  /**
   * FR1.9: Admission activity logging (simplified implementation)
   */
  private async logAdmissionActivity(studentId: string, action: string, details: any): Promise<void> {
    // In a real implementation, this would save to an audit log table
    console.log(`ADMISSION_ACTIVITY: ${action}`, {
      studentId,
      timestamp: new Date(),
      details,
      userId: 'system'
    });
  }

  /**
   * FR1.9: Get student audit logs (simplified implementation)
   */
  private async getStudentAuditLogs(studentId: string): Promise<any[]> {
    // In a real implementation, this would query an audit log table
    return [
      {
        action: 'STUDENT_ADMITTED',
        timestamp: new Date(),
        details: { system: 'auto-generated' }
      }
    ];
  }

  /**
   * Utility: Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Helper method to get class name by ID
   */
  private async getClassnameById(classId: number): Promise<string> {
    const classData = await this.prisma.class.findUnique({
      where: { id: classId },
      select: { name: true }
    });
    return classData?.name || 'Unknown';
  }

  /**
   * Helper method to get academic session name by ID
   */
  private async getAcademicSessionNameById(sessionId: number): Promise<string> {
    const session = await this.prisma.academicSession.findUnique({
      where: { id: sessionId },
      select: { name: true }
    });
    return session?.name || 'Unknown';
  }

  /**
   * Get admission statistics for dashboard
   */
  async getAdmissionStatistics(academicSession?: string): Promise<any> {
    try {
      const where: any = {};
      if (academicSession) {
        where.session = {
          name: academicSession
        };
      }

      const totalStudents = await this.prisma.student.count({ where });
      
      const statusCounts = await this.prisma.student.groupBy({
        by: ['status'],
        where,
        _count: {
          _all: true
        }
      });

      const classDistribution = await this.prisma.student.groupBy({
        by: ['classId'],
        where,
        _count: {
          _all: true
        }
      });

      const recentAdmissions = await this.prisma.student.findMany({
        where,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          class: true
        }
      });

      // Enhance with class names
      const enhancedRecentAdmissions = recentAdmissions.map(student => ({
        ...student,
        class: student.class.name
      }));

      return {
        totalStudents,
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr.status] = curr._count._all;
          return acc;
        }, {} as Record<string, number>),
        classDistribution: classDistribution.reduce((acc, curr) => {
          acc[curr.classId] = curr._count._all;
          return acc;
        }, {} as Record<number, number>),
        recentAdmissions: enhancedRecentAdmissions,
        academicSession: academicSession || 'all'
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admission statistics');
    }
  }

  /**
   * Search students with multiple criteria
   */
  async searchStudents(criteria: {
    name?: string;
    studentId?: string;
    class?: string;
    academicSession?: string;
    status?: string;
  }): Promise<any[]> {
    try {
      const where: any = {};

      if (criteria.name) {
        where.OR = [
          { firstName: { contains: criteria.name, mode: 'insensitive' } },
          { lastName: { contains: criteria.name, mode: 'insensitive' } }
        ];
      }

      if (criteria.studentId) {
        where.studentId = criteria.studentId;
      }

      if (criteria.class) {
        where.class = {
          name: criteria.class
        };
      }

      if (criteria.academicSession) {
        where.session = {
          name: criteria.academicSession
        };
      }

      if (criteria.status) {
        where.status = criteria.status;
      }

      const students = await this.prisma.student.findMany({
        where,
        include: {
          class: {
            include: {
              session: true
            }
          }
        },
        orderBy: { firstName: 'asc' }
      });

      // Enhance with names
      return await Promise.all(
        students.map(async (student) => ({
          ...student,
          academicSession: await this.getAcademicSessionNameById(student.sessionId),
          class: await this.getClassnameById(student.classId)
        }))
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to search students');
    }
  }

  /**
   * FR1.7: Assign student to class and section automatically based on configuration
   */
  async assignStudentToClass(studentId: string, classConfig: { classId: number }): Promise<any> {
    try {
      const student = await this.findByStudentId(studentId);
      
      const updatedStudent = await this.prisma.student.update({
        where: { id: student.id },
        data: {
          classId: classConfig.classId
        },
        include: {
          class: {
            include: {
              session: true
            }
          }
        }
      });

      // Log class assignment
      await this.logAdmissionActivity(studentId, 'CLASS_ASSIGNED', {
        previousClass: student.class,
        newClass: await this.getClassnameById(updatedStudent.classId)
      });

      return {
        ...updatedStudent,
        academicSession: await this.getAcademicSessionNameById(updatedStudent.sessionId),
        class: await this.getClassnameById(updatedStudent.classId)
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to assign student to class');
    }
  }
}
