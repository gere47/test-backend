import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { PrismaModule } from '../../database/prisma.module';
// import { StudentsModule } from '../student-admission/students.module';
// OR check the correct path in your project// OR check the correct path in your project
@Module({
  imports: [PrismaModule],
  controllers: [GradingController],
  providers: [GradingService],
  exports: [GradingService],
})
export class GradingModule {}
