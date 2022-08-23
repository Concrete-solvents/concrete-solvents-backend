// Libraries
import { Response } from 'express';
import { Result } from 'oxide.ts';
import { Controller, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { SendEmailVerificationCodeCommand } from '@Email/cqrs/commands/send-email-verification-code.command';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class SendVerificationCodeHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('email/sendVerificationCode')
  async sendVerificationCode(
    @User() user: UserBaseResponse,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sendVerificationCodeCommand = new SendEmailVerificationCodeCommand({
      userId: user.id,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      sendVerificationCodeCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.UserDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.EmailDoesNotLinked) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.EmailAlreadyConfirmed) {
      res.status(HttpStatus.CONFLICT);
    }

    return error;
  }
}

export { SendVerificationCodeHttpController };
