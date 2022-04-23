// Libraries
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

// Auth
import { AuthService } from '@Auth/auth.service';
import { LoginRequest } from '@Auth/dtos/login-request.dto';
import { LoginResponseWithAccessToken } from '@Auth/dtos/login-response-with-access-token.dto';
import { LoginResponse } from '@Auth/dtos/login-response.dto';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';
import { RegistrationRequest } from '@Auth/dtos/registration-request.dto';

// Common
import { CoreResponse } from '@Common/dtos/core-response.dto';
import { CustomError } from '@Common/enums/custom-errors';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Set a token in the cookie',
    type: LoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong login or password',
    type: CoreResponse,
  })
  async login(
    @Body() loginDto: LoginRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<CoreResponse | LoginResponse> {
    const result = await this.authService.login(loginDto);

    if (
      !result.isSuccess &&
      result.error === CustomError.WrongLoginOrPassword
    ) {
      res.status(HttpStatus.UNAUTHORIZED);
      return result;
    }

    res.cookie('jwt', result['access_token'], {
      maxAge: 36000000,
      sameSite: 'none',
      secure: true,
      path: '/',
      httpOnly: true,
    });

    return {
      isSuccess: true,
      user: (result as LoginResponseWithAccessToken).user,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register a new user and set a token in the cookie',
    type: RegistrationResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The username is not compatible with the template',
    type: CoreResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user already exists',
    type: CoreResponse,
  })
  async register(
    @Body() registrationDto: RegistrationRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<RegistrationResponse | CoreResponse> {
    const result = await this.authService.register(registrationDto);

    if (!result.isSuccess && result.error === CustomError.AlreadyExist) {
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

    res.cookie('jwt', result['access_token'], {
      maxAge: 36000000,
      sameSite: 'none',
      secure: true,
      path: '',
      httpOnly: true,
    });

    return {
      user: (result as RegistrationResponse).user,
      isSuccess: true,
    };
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<CoreResponse> {
    res.cookie('jwt', '', {
      expires: new Date(1),
      sameSite: 'none',
      secure: true,
      path: '',
      httpOnly: true,
    });

    return {
      isSuccess: true,
    };
  }
}
