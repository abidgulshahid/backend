import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // In production, use environment variable
    });
  }

  validate(payload: { sub: string; email: string; role: string }) {
    console.log('payload', payload);
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
