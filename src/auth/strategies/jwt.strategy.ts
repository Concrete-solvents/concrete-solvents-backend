// Libraries
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

// Auth
import { cookieExtractor } from '@Auth/extractors/cookie.extractor';

// User
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: UserBaseResponse) {
    return payload;
  }
}
