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
import { RegistrationCommand } from '@Auth/cqrs/commands/registration.command';
import { RegistrationRequest } from '@Auth/dtos/registration-request.dto';
import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

@Controller()
class RegistrationHttpController {
  constructor(
    private readonly _commandBus: CommandBus,
    private readonly _jwtService: JwtService,
  ) {}

  @Post('auth/registration')
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
    description: 'The user with given login or email already exists',
    type: RegistrationResponse,
  })
  async registration(
    @Body() dto: RegistrationRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new RegistrationCommand({
      login: dto.login,
      password: dto.password,
      language: dto.language,
      email: dto.email,
    });

    const result: Result<RegistrationResponse, CustomError> =
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
  }
}

export { RegistrationHttpController };
