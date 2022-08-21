// Libraries
import { Result } from 'oxide.ts';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupInvite
import { CancelGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/cancel-group-invite-to-user.command';
import { CancelGroupInviteToUserRequestDto } from '@GroupInvite/dtos/requests/cancel-group-invite-to-user-request.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class CancelGroupInviteToUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/cancelInvite')
  async cancelInvite(
    @User() user: UserBaseResponse,
    @Body() dto: CancelGroupInviteToUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cancelInviteCommand = new CancelGroupInviteToUserCommand({
      userId: user.id,
      inviteId: dto.inviteId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      cancelInviteCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.InviteDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);

      return error;
    }

    res.status(HttpStatus.FORBIDDEN);

    return error;
  }
}

export { CancelGroupInviteToUserHttpController };
