// src/modules/iam/application/strategies/jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken') || ExtractJwt.fromUrlQueryParameter('refreshToken'),
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    } as any);
  }

  async validate(req: any, payload: any) {
    // payload contains sub (user id) if signature valid
    // We'll rely on TokenService.validateRefreshToken for DB checks
    return payload;
  }
}
