import { CustomError } from '@Common/enums/custom-errors';
import { AcceptRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/accept-request-to-join-group.command';
import { AcceptRequestToJoinGroupRequestDto } from '@GroupJoinRequest/dtos/requests/accept-request-to-join-group-request.dto';
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
class AcceptRequestToJoinGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/acceptJoinRequest')
  async acceptRequestToJoinGroup(
    @User() user: UserBaseResponse,
    @Body() dto: AcceptRequestToJoinGroupRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const acceptRequestToJoinGroupCommand = new AcceptRequestToJoinGroupCommand(
      {
        userId: user.id,
        joinRequestId: dto.joinRequestId,
      },
    );

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      acceptRequestToJoinGroupCommand,
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

export { AcceptRequestToJoinGroupHttpController };
