// src/modules/iam/application/services/token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
  revoked: boolean;
}

@Injectable()
export class TokenService {
  private refreshTokens: Map<string, RefreshToken> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    this.refreshTokens.set(token, {
      token,
      userId,
      expiresAt,
      revoked: false,
    });

    return token;
  }

  async validateRefreshToken(token: string): Promise<{ userId: string }> {
    const refreshToken = this.refreshTokens.get(token);
    
    if (!refreshToken || refreshToken.revoked || refreshToken.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: refreshToken.userId };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = this.refreshTokens.get(token);
    if (refreshToken) {
      refreshToken.revoked = true;
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    for (const [token, refreshToken] of this.refreshTokens.entries()) {
      if (refreshToken.userId === userId && !refreshToken.revoked) {
        refreshToken.revoked = true;
      }
    }
  }
}