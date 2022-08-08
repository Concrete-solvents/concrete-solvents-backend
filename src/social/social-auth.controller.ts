// Libraries
import { AuthService } from '@Auth/auth.service';
import { SocialUser } from '@Auth/interfaces/social-user.interface';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

// User
import { User } from '@User/decorators/user.decorator';

@Controller('auth/social')
@ApiTags('Social auth')
class SocialAuthController {
  constructor(
    private readonly _authService: AuthService,
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
  ): Promise<RegistrationResponse> {
    const result = await this._authService.socialLogin('github', user);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    res.cookie(
      'jwt',
      this._jwtService.sign(result.user, { expiresIn: '365d' }),
      BASE_JWT_OPTION,
    );

    const clientUrl = this._configService.get<string>('ORIGIN');

    res.redirect(`${clientUrl}/auth/social`);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegistrationResponse> {
    const result = await this._authService.socialLogin('google', user);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    res.cookie(
      'jwt',
      this._jwtService.sign(result.user, { expiresIn: '365d' }),
      BASE_JWT_OPTION,
    );

    const clientUrl = this._configService.get<string>('ORIGIN');

    res.redirect(`${clientUrl}/auth/social`);
  }

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  steamAuth() {}

  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  async steamAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegistrationResponse> {
    const result = await this._authService.socialLogin('steam', user);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    res.cookie(
      'jwt',
      this._jwtService.sign(result.user, { expiresIn: '365d' }),
      BASE_JWT_OPTION,
    );

    const clientUrl = this._configService.get<string>('ORIGIN');

    res.redirect(`${clientUrl}/auth/social`);
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordAuth() {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(
    @User() user: SocialUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegistrationResponse> {
    const result = await this._authService.socialLogin('discord', user);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
      };
    }

    res.cookie(
      'jwt',
      this._jwtService.sign(result.user, { expiresIn: '365d' }),
      BASE_JWT_OPTION,
    );

    const clientUrl = this._configService.get<string>('ORIGIN');

    res.redirect(`${clientUrl}/auth/social`);
  }
}

export { SocialAuthController };
