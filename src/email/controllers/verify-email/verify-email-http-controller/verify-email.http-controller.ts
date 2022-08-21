// Libraries
import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { VerifyEmailCommand } from '@Email/cqrs/commands/verify-email.command';

@Controller()
class VerifyEmailHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Get('email/verifyEmail')
  async verifyEmail(
    @Query('email') email: string,
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const verifyEmailCommand = new VerifyEmailCommand({
      emailValue: email,
      verificationCode: code,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      verifyEmailCommand,
    );

    if (result.isOk()) {
      return 'Email verified';
    }

    const error = result.unwrapErr();

    if (error === CustomError.EmailDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { VerifyEmailHttpController };
