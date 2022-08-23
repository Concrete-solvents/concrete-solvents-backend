// Libraries
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

// Auth
import { SocialUser } from '@Auth/interfaces/social-user.interface';

@Injectable()
class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: 'http://localhost:3001/auth/social/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { email, picture } = profile._json;
    const { id } = profile;
    const user: SocialUser = {
      email,
      id,
      avatarUrl: picture,
    };
    done(null, user);
  }
}

export { GoogleStrategy };
