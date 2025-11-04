import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

// Placeholder if later using JWT-based refresh; for now refresh is stored DB token
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({ jwtFromRequest: (req: any) => null, secretOrKey: 'unused' });
  }
  async validate() { return {}; }
}
