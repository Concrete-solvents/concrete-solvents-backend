// Libraries
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Email
import { SendAccountRestoreCodeCommand } from '@Email/cqrs/commands/send-account-restore-code.command';
import { SendAccountRestoreCodeRequestDto } from '@Email/dtos/send-account-restore-code-request.dto';

@Controller()
class SendAccountRestoreCodeHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('email/sendRestoreCode')
  async sendAccountRestoreCode(
    @Body() dto: SendAccountRestoreCodeRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sendAccountRestoreCodeCommand = new SendAccountRestoreCodeCommand({
      emailValue: dto.email,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      sendAccountRestoreCodeCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.EmailNotFoundOrNotConfirmed) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return result.unwrapErr();
  }
}

export { SendAccountRestoreCodeHttpController };
