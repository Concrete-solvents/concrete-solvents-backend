// Libraries
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Auth
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';
import { LoginCommand } from '@Auth/cqrs/commands/login.command';
import { LoginRequest } from '@Auth/dtos/login-request.dto';
import { LoginResponse } from '@Auth/dtos/login-response.dto';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

@Controller()
class LoginHttpController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _jwtService: JwtService,
  ) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Set a token in the cookie',
    type: RegistrationResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: CustomError.WrongLoginOrPassword,
    type: LoginResponse,
  })
  async login(
    @Body() dto: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new LoginCommand({
      login: dto.login,
      password: dto.password,
    });

    const result: Result<LoginResponse, string> =
      await this._commandBus.execute(command);

    if (result.isOk()) {
      const unwrappedResult = result.unwrap();

      res.cookie(
        'jwt',
        this._jwtService.sign(unwrappedResult.user),
        BASE_JWT_OPTION,
      );

      return unwrappedResult;
    }

    res.status(HttpStatus.UNAUTHORIZED);
    return result;
  }
}

export { LoginHttpController };
