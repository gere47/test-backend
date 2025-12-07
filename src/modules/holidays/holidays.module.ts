import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}