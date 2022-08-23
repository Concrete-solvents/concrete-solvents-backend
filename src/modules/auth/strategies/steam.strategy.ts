// Libraries
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { Injectable } from '@nestjs/common';

// Auth
import { SocialUser } from '@Auth/interfaces/social-user.interface';

@Injectable()
class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: 'http://localhost:3001/auth/social/steam/callback',
      realm: 'http://localhost:3001/',
      apiKey: '8DF449C42FAB57A269F8097C81B52CDA',
    });
  }

  async validate(identifier, profile, done): Promise<void> {
    const { steamid, avatar } = profile._json;
    const user: SocialUser = {
      id: steamid,
      avatarUrl: avatar,
      email: null,
    };
    done(null, user);
  }
}

export { SteamStrategy };
