import { CustomError } from '@Common/enums/custom-errors';
import { SendGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/send-group-invite-to-user.command';
import { SendGroupInviteToUserRequestDto } from '@GroupInvite/dtos/requests/send-group-invite-to-user-request.dto';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Response } from 'express';
import { Result } from 'oxide.ts';

@Controller()
class SendGroupInviteToUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/groups/:groupId/sendInvite')
  async sendInvite(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: SendGroupInviteToUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sendInviteCommand = new SendGroupInviteToUserCommand({
      groupId,
      sentByUserId: user.id,
      sentToUserId: dto.sentToUserId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      sendInviteCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);

      return error;
    }

    if (error === CustomError.UserDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);

      return error;
    }

    if (error === CustomError.UserAlreadyInvited) {
      res.status(HttpStatus.CONFLICT);

      return error;
    }

    if (error === CustomError.GroupDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);

      return error;
    }

    res.status(HttpStatus.BAD_REQUEST);

    return error;
  }
}

export { SendGroupInviteToUserHttpController };
