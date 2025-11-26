// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/database/prisma.module';
import { IamModule } from './modules/iam/iam.module';
import { StudentModule } from './modules/student/student.module';
// Remove AcademicModule import

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    IamModule,
    StudentModule,
    // Remove AcademicModule from imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}