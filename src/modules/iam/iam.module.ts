// src/modules/iam/iam.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/services/auth.service';
import { TokenService } from './application/services/token.service';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'fallback-secret',
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    UserRepository,
  ],
  exports: [AuthService, TokenService, UserRepository],
})
export class IamModule {}