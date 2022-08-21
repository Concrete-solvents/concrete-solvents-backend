// Libraries
import { Response } from 'express';
import { Result } from 'oxide.ts';
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

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupInvite
import { RejectGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/reject-group-invite-to-user.command';
import { RejectGroupInviteToUserRequestDto } from '@GroupInvite/dtos/requests/reject-group-invite-to-user-request.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class RejectGroupInviteToUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/rejectInvite')
  async rejectGroupInviteToUser(
    @User() user: UserBaseResponse,
    @Body() dto: RejectGroupInviteToUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rejectGroupInviteToUserCommand = new RejectGroupInviteToUserCommand({
      userId: user.id,
      inviteId: dto.inviteId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      rejectGroupInviteToUserCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.InviteDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { RejectGroupInviteToUserHttpController };
