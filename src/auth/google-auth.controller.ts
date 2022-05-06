// Libraries
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';
import { GoogleAuthService } from '@Auth/google-auth.service';

@Controller('auth/google')
@ApiTags('Google auth')
class GoogleAuthController {
  constructor(
    private readonly _googleAuthService: GoogleAuthService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._googleAuthService.googleLogin(req);

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

    res.redirect(`${clientUrl}/auth/google`);
  }
}

export { GoogleAuthController };
