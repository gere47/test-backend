// src/modules/student/application/services/student-admission.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { StudentRepository } from '../../infrastructure/repositories/student.repository';
import { UserRepository } from '../../../iam/infrastructure/repositories/user.repository';
import { StudentAdmissionDto } from '../dto/student-admission.dto';
import { GuardianInfoDto } from '../dto/guardian-info.dto';
import { EducationalBackgroundDto } from '../dto/educational-background.dto';
import { StudentStatus } from '../../domain/enums/student-status.enum';
import { Gender } from '../../domain/enums/gender.enum';
import { AdmissionStatus } from '../../domain/enums/admission-status.enum';
import { hash } from 'bcrypt';

@Injectable()
export class StudentAdmissionService {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async admitStudent(admissionDto: StudentAdmissionDto, admittedBy: string) {
    // Check for existing user
    const existingUser = await this.userRepository.findByEmail(admissionDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate unique student code
    const studentCode = await this.generateStudentCode();

    // Create user account
    const hashedPassword = await hash(this.generateTemporaryPassword(), 12);
    
    const user = await this.userRepository.create({
      email: admissionDto.email,
      password: hashedPassword,
      role: 'STUDENT',
      firstName: admissionDto.firstName,
      lastName: admissionDto.lastName,
      phone: admissionDto.phone,
      status: 'ACTIVE',
    });

    // Create student record
    const student = await this.studentRepository.create({
      userId: user.id,
      studentCode,
      firstName: admissionDto.firstName,
      lastName: admissionDto.lastName,
      dateOfBirth: new Date(admissionDto.dateOfBirth),
      gender: admissionDto.gender as Gender,
      nationality: admissionDto.nationality,
      religion: admissionDto.religion,
      address: admissionDto.address,
      city: admissionDto.city,
      state: admissionDto.state,
      country: admissionDto.country,
      postalCode: admissionDto.postalCode,
      emergencyContact: admissionDto.emergencyContact,
      medicalInfo: admissionDto.medicalInfo,
      status: StudentStatus.ACTIVE,
    });

    // Add guardians
    if (admissionDto.guardians && admissionDto.guardians.length > 0) {
      for (const guardianDto of admissionDto.guardians) {
        await this.studentRepository.addGuardian(student.id, {
          firstName: guardianDto.firstName,
          lastName: guardianDto.lastName,
          relationship: guardianDto.relationship,
          email: guardianDto.email,
          phone: guardianDto.phone,
          occupation: guardianDto.occupation,
          address: guardianDto.address,
          isPrimary: guardianDto.isPrimary,
        });
      }
    }

    // Add educational background
    if (admissionDto.educationalBackground && admissionDto.educationalBackground.length > 0) {
      for (const educationDto of admissionDto.educationalBackground) {
        await this.studentRepository.addEducationalBackground(student.id, {
          institution: educationDto.institution,
          qualification: educationDto.qualification,
          startDate: new Date(educationDto.startDate),
          endDate: educationDto.endDate ? new Date(educationDto.endDate) : null,
          grade: educationDto.grade,
          description: educationDto.description,
        });
      }
    }

    // Create admission record
    const admissionRecord = await this.studentRepository.createAdmissionRecord({
      studentId: student.id,
      academicYear: admissionDto.academicYear,
      class: admissionDto.class,
      section: admissionDto.section,
      rollNumber: admissionDto.rollNumber,
      status: AdmissionStatus.APPROVED,
      appliedDate: new Date(),
      approvedDate: new Date(),
      approvedBy: admittedBy,
      notes: admissionDto.notes,
    });

    // Create audit log
    await this.userRepository.createAuditLog({
      userId: admittedBy,
      action: 'STUDENT_ADMITTED',
      resource: 'STUDENT',
      resourceId: student.id,
      details: {
        studentCode,
        class: admissionDto.class,
        section: admissionDto.section,
      },
    });

    return {
      student: {
        id: student.id,
        studentCode: student.studentCode,
        firstName: student.firstName,
        lastName: student.lastName,
        email: admissionDto.email,
        class: admissionDto.class,
        section: admissionDto.section,
        rollNumber: admissionDto.rollNumber,
      },
      temporaryPassword: this.generateTemporaryPassword(),
    };
  }

  async getStudentProfile(studentId: string) {
    const student = await this.studentRepository.findByIdWithDetails(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async updateStudentProfile(studentId: string, updateData: Partial<StudentAdmissionDto>) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const updatedStudent = await this.studentRepository.update(studentId, {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined,
      gender: updateData.gender as Gender,
      nationality: updateData.nationality,
      religion: updateData.religion,
      address: updateData.address,
      city: updateData.city,
      state: updateData.state,
      country: updateData.country,
      postalCode: updateData.postalCode,
      emergencyContact: updateData.emergencyContact,
      medicalInfo: updateData.medicalInfo,
    });

    return updatedStudent;
  }

  async addGuardian(studentId: string, guardianDto: GuardianInfoDto) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const guardian = await this.studentRepository.addGuardian(studentId, guardianDto);
    return guardian;
  }

  async addEducationalBackground(studentId: string, educationDto: EducationalBackgroundDto) {
    const student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const education = await this.studentRepository.addEducationalBackground(studentId, educationDto);
    return education;
  }

  async getStudentsByClass(className: string, section?: string) {
    return this.studentRepository.findByClass(className, section);
  }

  async searchStudents(query: string) {
    return this.studentRepository.search(query);
  }

  private async generateStudentCode(): Promise<string> {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    const code = `STU${year}${random}`;
    
    // Check if code exists
    const existing = await this.studentRepository.findByStudentCode(code);
    if (existing) {
      return this.generateStudentCode(); // Recursive call if code exists
    }
    
    return code;
  }

  private generateTemporaryPassword(): string {
    return Math.random().toString(36).slice(-8) + 'A1!';
  }
}