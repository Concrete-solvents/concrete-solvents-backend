// Libraries
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
import { GithubAuthService } from '@Auth/github-auth.service';
import { GithubUser } from '@Auth/interfaces/github-user.interface';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

// User
import { User } from '@User/decorators/user.decorator';

@Controller('auth/github')
@ApiTags('Github auth')
class GithubAuthController {
  constructor(
    private readonly _githubAuthService: GithubAuthService,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('github'))
  googleAuth() {}

  @Get('callback')
  @UseGuards(AuthGuard('github'))
  async googleAuthRedirect(
    @User() user: GithubUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegistrationResponse> {
    const result = await this._githubAuthService.githubLogin(user);

    if (!result.isSuccess) {
      return {
        isSuccess: false,
        error: CustomError.PermissionError,
        user: null,
      };
    }

    res.cookie(
      'jwt',
      this._jwtService.sign(result.user, { expiresIn: '365d' }),
      BASE_JWT_OPTION,
    );

    const clientUrl = this._configService.get<string>('ORIGIN');

    res.redirect(`${clientUrl}/auth/github`);
  }
}

export { GithubAuthController };
