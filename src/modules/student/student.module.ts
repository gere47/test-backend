// src/modules/student/student.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../core/database/prisma.module';
import { IamModule } from '../iam/iam.module';
import { StudentAdmissionService } from './application/services/student-admission.service';
import { StudentRepository } from './infrastructure/repositories/student.repository';
import { StudentAdmissionController } from './presentation/controllers/student-admission.controller';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [StudentAdmissionController],
  providers: [StudentAdmissionService, StudentRepository],
  exports: [StudentAdmissionService],
})
export class StudentModule {}