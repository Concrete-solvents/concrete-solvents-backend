// Libraries
import { Result } from 'oxide.ts';
import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';
import { LoginUserWithSocialCommand } from '@Auth/cqrs/commands/login-user-with-social.command';
import { LoginResponse } from '@Auth/dtos/login-response.dto';
import { SocialUser } from '@Auth/interfaces/social-user.interface';

// User
import { User } from '@User/decorators/user.decorator';


@Controller('auth/social')
@ApiTags('Social auth')
class SocialAuthController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new LoginUserWithSocialCommand({
      socialName: 'github',
      user,
    });

    const result: Result<LoginResponse, CustomError> =
      await this._commandBus.execute(command);

    if (result.isOk()) {
      const unwrappedResult = result.unwrap();

      res.cookie(
        'jwt',
        this._jwtService.sign(unwrappedResult.user, { expiresIn: '365d' }),
        BASE_JWT_OPTION,
      );

      const clientUrl = this._configService.get<string>('ORIGIN');

      res.redirect(`${clientUrl}/auth/social`);
    }

    res.status(HttpStatus.UNAUTHORIZED);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new LoginUserWithSocialCommand({
      socialName: 'google',
      user,
    });

    const result: Result<LoginResponse, CustomError> =
      await this._commandBus.execute(command);

    if (result.isOk()) {
      const unwrappedResult = result.unwrap();

      res.cookie(
        'jwt',
        this._jwtService.sign(unwrappedResult.user, { expiresIn: '365d' }),
        BASE_JWT_OPTION,
      );

      const clientUrl = this._configService.get<string>('ORIGIN');

      res.redirect(`${clientUrl}/auth/social`);
    }

    res.status(HttpStatus.UNAUTHORIZED);
  }

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  steamAuth() {}

  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  async steamAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new LoginUserWithSocialCommand({
      socialName: 'steam',
      user,
    });

    const result: Result<LoginResponse, CustomError> =
      await this._commandBus.execute(command);

    if (result.isOk()) {
      const unwrappedResult = result.unwrap();

      res.cookie(
        'jwt',
        this._jwtService.sign(unwrappedResult.user, { expiresIn: '365d' }),
        BASE_JWT_OPTION,
      );

      const clientUrl = this._configService.get<string>('ORIGIN');

      res.redirect(`${clientUrl}/auth/social`);
    }

    res.status(HttpStatus.UNAUTHORIZED);
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordAuth() {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new LoginUserWithSocialCommand({
      socialName: 'discord',
      user,
    });

    const result: Result<LoginResponse, CustomError> =
      await this._commandBus.execute(command);

    if (result.isOk()) {
      const unwrappedResult = result.unwrap();

      res.cookie(
        'jwt',
        this._jwtService.sign(unwrappedResult.user, { expiresIn: '365d' }),
        BASE_JWT_OPTION,
      );

      const clientUrl = this._configService.get<string>('ORIGIN');

      res.redirect(`${clientUrl}/auth/social`);
    }

    res.status(HttpStatus.UNAUTHORIZED);
  }
}

export { SocialAuthController };
