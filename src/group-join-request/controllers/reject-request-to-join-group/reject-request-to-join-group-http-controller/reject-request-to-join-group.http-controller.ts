import { CustomError } from '@Common/enums/custom-errors';
import { RejectRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/reject-request-to-join-group.command';
import { RejectRequestToJoinGroupRequestDto } from '@GroupJoinRequest/dtos/requests/reject-request-to-join-group-request.dto';
import {
  Body,
  Controller,
  HttpStatus,
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
class RejectRequestToJoinGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/rejectJoinRequest')
  async rejectRequestToJoinGroup(
    @User() user: UserBaseResponse,
    @Body() dto: RejectRequestToJoinGroupRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rejectRequestToJoinGroupCommand = new RejectRequestToJoinGroupCommand(
      {
        userId: user.id,
        joinRequestId: dto.joinRequestId,
      },
    );

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      rejectRequestToJoinGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.JoinRequestDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    return error;
  }
}

export { RejectRequestToJoinGroupHttpController };
