import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') 
                    || 'fallback-secret-key-minimum-32-characters-long',
    });
  }

  async validate(payload: any) {
    return { 
      id: payload.sub,        // FIX: return id instead of userId
      email: payload.email,
      role: payload.role,
      roleId: payload.roleId
    };
  }
}
