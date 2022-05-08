// Libraries
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

// Auth
import { AuthService } from '@Auth/auth.service';
import { LoginRequest } from '@Auth/dtos/login-request.dto';
import { LoginResponse } from '@Auth/dtos/login-response.dto';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';
import { RegistrationRequest } from '@Auth/dtos/registration-request.dto';
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';

// Common
import { CoreResponse } from '@Common/dtos/core-response.dto';
import { CustomError } from '@Common/enums/custom-errors';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Set a token in the cookie',
    type: RegistrationResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CustomError.WrongUsernameOrPassword,
    type: LoginResponse,
  })
  async login(
    @Body() loginDto: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const result = await this._authService.login(loginDto);

    if (
      !result.isSuccess &&
      result.error === CustomError.WrongUsernameOrPassword
    ) {
      res.status(HttpStatus.UNAUTHORIZED);
      return result;
    }

    res.cookie('jwt', this._jwtService.sign(result.user), BASE_JWT_OPTION);

    return result;
  }

  @Post('registration')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register a new user and set a token in the cookie',
    type: RegistrationResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The username is not compatible with the template',
    type: RegistrationResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user already exists',
    type: RegistrationResponse,
  })
  async registration(
    @Body() registrationDto: RegistrationRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegistrationResponse> {
    const result = await this._authService.registration(registrationDto);

    if (
      !result.isSuccess &&
      (result.error === CustomError.UserWithGivenUsernameAlreadyExist ||
        result.error === CustomError.UserWithGivenEmailAlreadyExist)
    ) {
      res.status(HttpStatus.CONFLICT);
      return result;
    }

    if (
      !result.isSuccess &&
      result.error === CustomError.UsernameIncompatibleWithPattern
    ) {
      res.status(HttpStatus.BAD_REQUEST);
      return result;
    }

    res.cookie('jwt', this._jwtService.sign(result.user), BASE_JWT_OPTION);

    return result;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<CoreResponse> {
    res.cookie('jwt', '', { ...BASE_JWT_OPTION, ...{ maxAge: 1 } });

    return {
      isSuccess: true,
    };
  }
}
