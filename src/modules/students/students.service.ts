import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new student with user account
   * Auto-generates student ID based on year
   */
  async create(createStudentDto: CreateStudentDto) {
    this.logger.log(`Creating new student: ${createStudentDto.admissionNumber}`);

    // Validate class exists
    const classExists = await this.prisma.class.findUnique({
      where: { id: createStudentDto.classId },
      include: { session: true },
    });

    if (!classExists) {
      throw new NotFoundException('Class not found');
    }

    // Check class capacity
    if (classExists.currentStrength >= classExists.capacity) {
      throw new BadRequestException('Class capacity is full');
    }

    // Validate session exists
    const sessionExists = await this.prisma.academicSession.findUnique({
      where: { id: createStudentDto.sessionId },
    });

    if (!sessionExists) {
      throw new NotFoundException('Academic session not found');
    }

    // Check for duplicate admission number
    const duplicateAdmission = await this.prisma.student.findUnique({
      where: { admissionNumber: createStudentDto.admissionNumber },
    });

    if (duplicateAdmission) {
      throw new ConflictException('Admission number already exists');
    }

    // Check for duplicate username
    const duplicateUsername = await this.prisma.user.findUnique({
      where: { username: createStudentDto.username },
    });

    if (duplicateUsername) {
      throw new ConflictException('Username already exists');
    }

    // Check for duplicate email
    const duplicateEmail = await this.prisma.user.findUnique({
      where: { email: createStudentDto.email },
    });

    if (duplicateEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createStudentDto.password, 12);

    // Get student role (roleId: 4 from seed data)
    const studentRole = await this.prisma.role.findFirst({
      where: { name: 'Student' },
    });

    if (!studentRole) {
      throw new NotFoundException('Student role not configured in system');
    }

    // Generate unique student ID
    const studentId = await this.generateStudentId();

    // Create student with user account in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create user account
      const user = await prisma.user.create({
        data: {
          username: createStudentDto.username,
          email: createStudentDto.email,
          passwordHash,
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          phone: createStudentDto.phone,
          roleId: studentRole.id,
          isActive: true,
        },
      });

      // Create student record
      const student = await prisma.student.create({
        data: {
          studentId,
          userId: user.id,
          admissionNumber: createStudentDto.admissionNumber,
          admissionDate: createStudentDto.admissionDate
            ? new Date(createStudentDto.admissionDate)
            : new Date(),
          classId: createStudentDto.classId,
          sessionId: createStudentDto.sessionId,
          rollNumber: createStudentDto.rollNumber,
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          dateOfBirth: new Date(createStudentDto.dateOfBirth),
          gender: createStudentDto.gender,
          bloodGroup: createStudentDto.bloodGroup,
          nationality: createStudentDto.nationality || 'Ethiopian',
          religion: createStudentDto.religion,
          category: createStudentDto.category,
          email: createStudentDto.email,
          phone: createStudentDto.phone,
          address: createStudentDto.address,
          city: createStudentDto.city,
          state: createStudentDto.state,
          pincode: createStudentDto.pincode,
          guardianName: createStudentDto.guardianName,
          guardianRelation: createStudentDto.guardianRelation,
          guardianPhone: createStudentDto.guardianPhone,
          guardianEmail: createStudentDto.guardianEmail,
          guardianOccupation: createStudentDto.guardianOccupation,
          guardianIncome: createStudentDto.guardianIncome ? 
            parseFloat(createStudentDto.guardianIncome.toString()) : null,
          previousSchool: createStudentDto.previousSchool,
          previousClass: createStudentDto.previousClass,
          previousPercentage: createStudentDto.previousPercentage ? 
            parseFloat(createStudentDto.previousPercentage.toString()) : null,
          tcNumber: createStudentDto.tcNumber,
          tcDate: createStudentDto.tcDate ? new Date(createStudentDto.tcDate) : null,
          medicalConditions: createStudentDto.medicalConditions,
          allergies: createStudentDto.allergies,
          emergencyContact: createStudentDto.emergencyContact,
          photoUrl: createStudentDto.photoUrl,
          birthCertificateUrl: createStudentDto.birthCertificateUrl,
          tcUrl: createStudentDto.tcUrl,
          aadharUrl: createStudentDto.aadharUrl,
          status: createStudentDto.status || 'Active',
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
          class: {
            include: {
              session: true,
            },
          },
          session: true,
        },
      });

      // Update class strength
      await prisma.class.update({
        where: { id: createStudentDto.classId },
        data: {
          currentStrength: {
            increment: 1,
          },
        },
      });

      return student;
    });

    this.logger.log(`Student created successfully: ${result.studentId}`);

    // Remove sensitive data
    const { user, ...studentData } = result;
    const { passwordHash: userPasswordHash, ...userData } = user as any;

    return {
      message: 'Student registered successfully',
      student: {
        ...studentData,
        user: userData,
      },
    };
  }

  /**
   * Get all students with pagination and filters
   */
  async findAll(query: QueryStudentDto) {
    const { page = 1, limit = 10, search, classId, sessionId, gender, status, grade, section } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { studentId: { contains: search, mode: 'insensitive' } },
        { admissionNumber: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (classId) where.classId = classId;
    if (sessionId) where.sessionId = sessionId;
    if (gender) where.gender = gender;
    if (status) where.status = status;

    if (grade || section) {
      where.class = {};
      if (grade) where.class.grade = grade;
      if (section) where.class.section = section;
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              isActive: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
              section: true,
              academicYear: true,
            },
          },
          session: {
            select: {
              id: true,
              name: true,
              startDate: true,
              endDate: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: students,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get student by ID with full details
   */
  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
          },
        },
        class: {
          include: {
            session: true,
            classTeacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        session: true,
        attendances: {
          take: 10,
          orderBy: {
            date: 'desc',
          },
        },
        examResults: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            exam: {
              select: {
                name: true,
                term: true,
                academicYear: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return {
      data: student,
    };
  }

  /**
   * Get student by student ID (e.g., STU2024001)
   */
  async findByStudentId(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { studentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        },
        class: true,
        session: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return {
      data: student,
    };
  }

  /**
   * Update student information
   */
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    this.logger.log(`Updating student ID: ${id}`);

    // Check if student exists
    const existingStudent = await this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingStudent) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // If changing class, validate and update strength
    if (updateStudentDto.classId && updateStudentDto.classId !== existingStudent.classId) {
      const newClass = await this.prisma.class.findUnique({
        where: { id: updateStudentDto.classId },
      });

      if (!newClass) {
        throw new NotFoundException('New class not found');
      }

      if (newClass.currentStrength >= newClass.capacity) {
        throw new BadRequestException('New class capacity is full');
      }
    }

    // Check for duplicate email if changing
    if (updateStudentDto.email && updateStudentDto.email !== existingStudent.email) {
      const duplicateEmail = await this.prisma.user.findFirst({
        where: {
          email: updateStudentDto.email,
          id: { not: existingStudent.userId },
        },
      });

      if (duplicateEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    // Prepare update data
    const updateData: any = { ...updateStudentDto };

    // Handle date conversions
    if (updateStudentDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    }
    if (updateStudentDto.tcDate) {
      updateData.tcDate = new Date(updateStudentDto.tcDate);
    }

    // Handle decimal conversions
    if (updateStudentDto.guardianIncome !== undefined) {
      updateData.guardianIncome = updateStudentDto.guardianIncome ? 
        parseFloat(updateStudentDto.guardianIncome.toString()) : null;
    }
    if (updateStudentDto.previousPercentage !== undefined) {
      updateData.previousPercentage = updateStudentDto.previousPercentage ? 
        parseFloat(updateStudentDto.previousPercentage.toString()) : null;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Update in transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Update user account if email or personal info changed
      if (updateStudentDto.email || updateStudentDto.firstName || updateStudentDto.lastName || updateStudentDto.phone) {
        await prisma.user.update({
          where: { id: existingStudent.userId },
          data: {
            ...(updateStudentDto.email && { email: updateStudentDto.email }),
            ...(updateStudentDto.firstName && { firstName: updateStudentDto.firstName }),
            ...(updateStudentDto.lastName && { lastName: updateStudentDto.lastName }),
            ...(updateStudentDto.phone && { phone: updateStudentDto.phone }),
          },
        });
      }

      // Update student record
      const student = await prisma.student.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          class: true,
          session: true,
        },
      });

      // Update class strengths if class changed
      if (updateStudentDto.classId && updateStudentDto.classId !== existingStudent.classId) {
        await prisma.class.update({
          where: { id: existingStudent.classId },
          data: { currentStrength: { decrement: 1 } },
        });

        await prisma.class.update({
          where: { id: updateStudentDto.classId },
          data: { currentStrength: { increment: 1 } },
        });
      }

      return student;
    });

    this.logger.log(`Student updated successfully: ${id}`);

    return {
      message: 'Student updated successfully',
      data: result,
    };
  }

  /**
   * Soft delete student (deactivate)
   */
  async remove(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    await this.prisma.$transaction(async (prisma) => {
      // Deactivate student
      await prisma.student.update({
        where: { id },
        data: {
          isActive: false,
          status: 'Inactive',
        },
      });
      
      // Deactivate user account
      await prisma.user.update({
        where: { id: student.userId },
        data: { isActive: false },
      });
      
      // Decrease class strength
      await prisma.class.update({
        where: { id: student.classId },
        data: { currentStrength: { decrement: 1 } },
      });
    });

    this.logger.log(`Student deactivated: ${id}`);

    return {
      message: 'Student deactivated successfully',
    };
  }

  /**
   * Generate unique student ID
   * Format: STU{YEAR}{INCREMENT}
   * Example: STU2024001
   */
  private async generateStudentId(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `STU${currentYear}`;

    // Get the last student ID for current year
    const lastStudent = await this.prisma.student.findFirst({
      where: {
        studentId: {
          startsWith: prefix,
        },
      },
      orderBy: {
        studentId: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastStudent) {
      const lastNumber = parseInt(lastStudent.studentId.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    // Pad with zeros (e.g., 001, 002, ...)
    const paddedNumber = nextNumber.toString().padStart(3, '0');
    return `${prefix}${paddedNumber}`;
  }

  /**
   * Get student statistics
   */
  async getStatistics() {
    const [total, active, inactive, male, female, byClass] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.student.count({ where: { status: 'Active' } }),
      this.prisma.student.count({ where: { status: 'Inactive' } }),
      this.prisma.student.count({ where: { gender: 'Male' } }),
      this.prisma.student.count({ where: { gender: 'Female' } }),
      this.prisma.student.groupBy({
        by: ['classId'],
        _count: true,
      }),
    ]);

    return {
      total,
      active,
      inactive,
      male,
      female,
      byClass,
    };
  }
}