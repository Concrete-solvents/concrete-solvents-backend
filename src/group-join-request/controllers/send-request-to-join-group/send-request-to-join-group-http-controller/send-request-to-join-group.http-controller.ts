import { CustomError } from '@Common/enums/custom-errors';
import { SendRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/send-request-to-join-group.command';
import {
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
class SendRequestToJoinGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/sendJoinRequest')
  async sendRequestToJoinGroup(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sendRequestToJoinGroupCommand = new SendRequestToJoinGroupCommand({
      userId: user.id,
      groupId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      sendRequestToJoinGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.RequestToJoinGroupAlreadyExist) {
      res.status(HttpStatus.CONFLICT);
    }

    if (error === CustomError.UserAlreadyInGroup) {
      res.status(HttpStatus.CONFLICT);
    }

    if (error === CustomError.GroupDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { SendRequestToJoinGroupHttpController };
