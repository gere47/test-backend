import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { PrismaModule } from '../../database/prisma.module';

// IMPORT ONLY SERVICES, NOT MODULES
import { AuditService } from '../../common/services/audit.service';
import { NotificationService } from '../../common/services/notification.service';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AuditService,
    NotificationService,
  ],
  exports: [AttendanceService],
})
export class AttendanceModule {}
