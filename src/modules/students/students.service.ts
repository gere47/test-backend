
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException,
  InternalServerErrorException 
  
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { 
  CreateStudentDto, 
  UpdateStudentDto, 
  StudentQueryDto 
} from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(createStudentDto: CreateStudentDto, userId: number) {
    if (!createStudentDto.termsAccepted) {
      throw new BadRequestException('Terms and conditions must be accepted');
    }

    return await this.prisma.$transaction(async (tx) => {
      await this.validateStudentData(createStudentDto, tx);
      const studentId = await this.generateStudentId(tx);

      try {
        const student = await tx.student.create({
          data: {
            // Personal info
            firstName: createStudentDto.firstName,
            lastName: createStudentDto.lastName,
            dateOfBirth: new Date(createStudentDto.dateOfBirth),
            gender: createStudentDto.gender,
            email: createStudentDto.email,
            phone: createStudentDto.phone,
            
            // Address info
            address: createStudentDto.address,
            city: createStudentDto.city,
            state: createStudentDto.state,
            pincode: createStudentDto.pincode,
            nationality: createStudentDto.nationality,
            
            // Guardian info
            guardianName: createStudentDto.guardianName,
            guardianPhone: createStudentDto.guardianPhone,
            guardianEmail: createStudentDto.guardianEmail,
            guardianRelation: createStudentDto.guardianRelation,
            guardianOccupation: createStudentDto.guardianOccupation,
            
            // Academic info
            sessionId: createStudentDto.sessionId,
            classId: createStudentDto.classId,
            
            // System fields
            studentId: studentId,
            admissionDate: new Date(),
            status: 'PENDING',
          },
        });

        // Create audit log
        await tx.auditLog.create({
          data: {
            userId,
            action: 'STUDENT_ADMISSION_CREATED',
            entityType: 'Student',
            entityId: student.id,
            description: `New admission created for ${student.firstName} ${student.lastName} with ID: ${student.studentId}`,
          },
        });

        return student;
      } catch (error) {
        console.error('Error creating student:', error);
        if (error.code === 'P2002') {
          throw new ConflictException('Duplicate student record detected');
        }
        throw new InternalServerErrorException('Failed to create student: ' + error.message);
      }
    });
  }

  async bulkCreateStudents(students: CreateStudentDto[], userId: number) {
    const results = {
      successful: [],
      failed: []
    };

    for (const studentData of students) {
      try {
        const student = await this.createStudent(studentData, userId);
        results.successful.push({
          studentId: student.studentId,
          name: `${student.firstName} ${student.lastName}`,
          status: 'SUCCESS'
        });
      } catch (error) {
        results.failed.push({
          data: studentData,
          error: error.message,
          status: 'FAILED'
        });
      }
    }

    return results;
  }

  async findAll(filters: StudentQueryDto) {
    const { sessionId, classId, status, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(sessionId && { sessionId }),
      ...(classId && { classId }),
      ...(status && { status }),
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { guardianName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: {
          class: {
            select: { id: true, name: true }
          },
          session: {
            select: { id: true, name: true }
          },
          documents: {
            where: { documentType: 'PHOTO' },
            take: 1,
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        session: true,
        documents: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async updateStudent(id: number, updateStudentDto: UpdateStudentDto, userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updateData: any = {};

    // Only update fields that are provided in the DTO
    if (updateStudentDto.firstName !== undefined) updateData.firstName = updateStudentDto.firstName;
    if (updateStudentDto.lastName !== undefined) updateData.lastName = updateStudentDto.lastName;
    if (updateStudentDto.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(updateStudentDto.dateOfBirth);
    if (updateStudentDto.gender !== undefined) updateData.gender = updateStudentDto.gender;
    if (updateStudentDto.email !== undefined) updateData.email = updateStudentDto.email;
    if (updateStudentDto.phone !== undefined) updateData.phone = updateStudentDto.phone;
    if (updateStudentDto.address !== undefined) updateData.address = updateStudentDto.address;
    if (updateStudentDto.city !== undefined) updateData.city = updateStudentDto.city;
    if (updateStudentDto.state !== undefined) updateData.state = updateStudentDto.state;
    if (updateStudentDto.pincode !== undefined) updateData.pincode = updateStudentDto.pincode;
    if (updateStudentDto.nationality !== undefined) updateData.nationality = updateStudentDto.nationality;
    if (updateStudentDto.guardianName !== undefined) updateData.guardianName = updateStudentDto.guardianName;
    if (updateStudentDto.guardianPhone !== undefined) updateData.guardianPhone = updateStudentDto.guardianPhone;
    if (updateStudentDto.guardianEmail !== undefined) updateData.guardianEmail = updateStudentDto.guardianEmail;
    if (updateStudentDto.guardianRelation !== undefined) updateData.guardianRelation = updateStudentDto.guardianRelation;
    if (updateStudentDto.guardianOccupation !== undefined) updateData.guardianOccupation = updateStudentDto.guardianOccupation;
    if (updateStudentDto.classId !== undefined) updateData.classId = updateStudentDto.classId;
    if (updateStudentDto.status !== undefined) updateData.status = updateStudentDto.status;

    const updatedStudent = await this.prisma.student.update({
      where: { id },
      data: updateData,
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'STUDENT_ADMISSION_UPDATED',
        entityType: 'Student',
        entityId: updatedStudent.id,
        description: `Admission updated for ${updatedStudent.firstName} ${updatedStudent.lastName}`,
      },
    });

    return updatedStudent;
  }

  async uploadDocument(studentId: number, file: any, documentType: string, description: string, userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    const document = await this.prisma.studentDocument.create({
      data: {
        studentId: studentId,
        documentType: documentType,
        fileName: file.originalname,
        fileUrl: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'STUDENT_DOCUMENT_UPLOADED',
        entityType: 'StudentDocument',
        entityId: document.id,
        description: `Document ${documentType} uploaded for student ${student.firstName} ${student.lastName}`,
      },
    });

    return document;
  }

  async getStudentDocuments(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.studentDocument.findMany({
      where: { studentId },
      orderBy: { uploadedAt: 'desc' },
    });
  }
  
  async assignClass(
    studentId: number,
    classId: number,
    section: string,
    remarks: string,
    userId: number,
  ) {
    // Ensure student exists
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Ensure class exists
    const classRecord = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classRecord) {
      throw new NotFoundException('Class not found');
    }

    // Update student record
    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: {
        classId,
        section,
        remarks,
        updatedBy: userId,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'STUDENT_CLASS_ASSIGNED',
        entityType: 'Student',
        entityId: studentId,
        description: `Student assigned to class ${classRecord.name}${section ? ', section ' + section : ''}`,
      },
    });

    return {
      message: 'Class assigned successfully',
      student: updatedStudent,
    };
  }

  async updateAdmissionStatus(studentId: number, status: string, remarks: string, userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updatedStudent = await this.prisma.student.update({
      where: { id: studentId },
      data: { 
        status,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'ADMISSION_STATUS_UPDATED',
        entityType: 'Student',
        entityId: studentId,
        description: `Status changed to ${status} for ${student.firstName} ${student.lastName}`,
      },
    });

    return updatedStudent;
  }

  async generateAdmissionForm(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        session: true,
        documents: {
          where: { documentType: 'PHOTO' },
          take: 1,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      student,
      formId: `ADM-${student.studentId}-${Date.now()}`,
      generatedAt: new Date(),
      institution: {
        name: 'Your Institution Name',
        address: 'Institution Address',
        contact: 'contact@institution.edu',
      },
    };
  }

  async generateConfirmationReceipt(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        session: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      student,
      receiptNumber: `REC-${student.studentId}-${Date.now()}`,
      generatedAt: new Date(),
      status: student.status,
    };
  }

  async getAdmissionHistory(studentId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.prisma.auditLog.findMany({
      where: {
        entityType: 'Student',
        entityId: studentId,
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getAdmissionStatistics() {
    const total = await this.prisma.student.count();
    
    const byStatus = await this.prisma.student.groupBy({
      by: ['status'],
      _count: true,
    });

    const byClass = await this.prisma.student.groupBy({
      by: ['classId'],
      _count: true,
      where: { 
        classId: { not: null }
      },
    });

    return {
      total,
      byStatus,
      byClass,
      summary: {
        pending: byStatus.find(s => s.status === 'PENDING')?._count || 0,
        approved: byStatus.find(s => s.status === 'APPROVED')?._count || 0,
        admitted: byStatus.find(s => s.status === 'ADMITTED')?._count || 0,
      }
    };
  }

  async searchStudents(query: string) {
    return this.prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { studentId: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { guardianName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        studentId: true,
        email: true,
        phone: true,
        status: true,
        class: {
          select: { name: true }
        },
      },
      take: 10,
    });
  }

  async softDeleteStudent(id: number, userId: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Since soft delete is not in schema, use hard delete
    await this.prisma.student.delete({
      where: { id },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'STUDENT_ADMISSION_DELETED',
        entityType: 'Student',
        entityId: id,
        description: `Student admission deleted: ${student.firstName} ${student.lastName}`,
      },
    });

    return { message: 'Student admission deleted successfully' };
  }

  async restoreStudent(id: number, userId: number) {
    throw new BadRequestException('Restore functionality not implemented. Soft delete not configured.');
  }

  private async validateStudentData(createStudentDto: CreateStudentDto, tx: any) {
    const errors: string[] = [];

    // Date validation
    const dob = new Date(createStudentDto.dateOfBirth);
    if (dob >= new Date()) {
      errors.push('Date of birth must be in the past');
    }

    // Age validation (at least 3 years old)
    const age = new Date().getFullYear() - dob.getFullYear();
    if (age < 3) {
      errors.push('Student must be at least 3 years old');
    }

    // Email uniqueness
    if (createStudentDto.email) {
      const existingEmail = await tx.student.findFirst({
        where: { email: createStudentDto.email },
      });
      if (existingEmail) {
        errors.push('Email already exists');
      }
    }

    // Session existence check
    const sessionExists = await tx.academicSession.findUnique({
      where: { id: createStudentDto.sessionId },
    });
    if (!sessionExists) {
      errors.push('Invalid academic session selected');
    }

    // Class existence check
    if (createStudentDto.classId) {
      const classExists = await tx.class.findUnique({
        where: { id: createStudentDto.classId },
      });
      if (!classExists) {
        errors.push('Invalid class selected');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(', '));
    }
  }

  private async generateStudentId(tx: any): Promise<string> {
    const year = new Date().getFullYear();
    const lastStudent = await tx.student.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { studentId: true },
    });

    let sequence = 1;
    if (lastStudent && lastStudent.studentId) {
      const lastSequence = parseInt(lastStudent.studentId.slice(-4)) || 0;
      sequence = lastSequence + 1;
    }

    return `STU${year}${sequence.toString().padStart(4, '0')}`;
  }
}