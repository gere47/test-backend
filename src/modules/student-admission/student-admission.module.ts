import { Module } from '@nestjs/common';
import { StudentAdmissionService } from './student-admission.service';
import { StudentAdmissionController } from './student-admission.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StudentAdmissionController],
  providers: [StudentAdmissionService],
})
export class StudentAdmissionModule {}
