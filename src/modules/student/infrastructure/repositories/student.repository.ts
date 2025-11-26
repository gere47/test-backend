import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    return this.prisma.student.create({
      data,
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }

  async findByIdWithDetails(id: string): Promise<any> {
    return this.prisma.student.findUnique({
      where: { id },
      include: {
        guardians: true,
        educationalBackgrounds: true, // FIXED: plural form
        admissionRecords: true,       // FIXED: plural form
        user: {
          select: {
            email: true,
            phone: true,
            status: true,
          },
        },
      },
    });
  }

  async findByStudentCode(studentCode: string): Promise<any> {
    return this.prisma.student.findUnique({
      where: { studentCode },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async addGuardian(studentId: string, guardianData: any): Promise<any> {
    return this.prisma.guardian.create({
      data: {
        ...guardianData,
        studentId,
      },
    });
  }

  async addEducationalBackground(studentId: string, educationData: any): Promise<any> {
    return this.prisma.educationalBackground.create({
      data: {
        ...educationData,
        studentId,
      },
    });
  }

  async createAdmissionRecord(data: any): Promise<any> {
    return this.prisma.admissionRecord.create({
      data,
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.student.findMany({
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async search(query: string): Promise<any> {
    return this.prisma.student.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { studentCode: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });
  }
}