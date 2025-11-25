import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AcademicSessionsModule } from './modules/academic-sessions/academic-sessions.module';
import { StudentAdmissionModule } from './modules/student-admission/student-admission.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    // Comment out ALL modules first
    AuthModule,
    UsersModule,
    AcademicSessionsModule,
    StudentAdmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}