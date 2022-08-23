// Libraries
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';

// Auth
import { SocialUser } from '@Auth/interfaces/social-user.interface';

@Injectable()
class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_SECRET'),
      callbackURL: 'http://localhost:3001/auth/social/github/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { avatar_url, id } = profile._json;
    const user: SocialUser = {
      avatarUrl: avatar_url,
      id,
      email: null,
    };
    done(null, user);
  }
}

export { GithubStrategy };
