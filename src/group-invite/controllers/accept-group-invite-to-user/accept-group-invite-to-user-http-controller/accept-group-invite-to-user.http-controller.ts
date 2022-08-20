import { CustomError } from '@Common/enums/custom-errors';
import { AcceptGroupInviteToUserCommand } from '@GroupInvite/cqrs/commands/accept-group-invite-to-user.command';
import { AcceptGroupInviteToUserRequestDto } from '@GroupInvite/dtos/requests/accept-group-invite-to-user-request.dto';
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
class AcceptGroupInviteToUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/acceptInvite')
  async acceptInvite(
    @User() user: UserBaseResponse,
    @Body() dto: AcceptGroupInviteToUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const acceptInviteCommand = new AcceptGroupInviteToUserCommand({
      userId: user.id,
      inviteId: dto.inviteId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      acceptInviteCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.UserAlreadyInGroup) {
      res.status(HttpStatus.CONFLICT);
    }

    if (error === CustomError.InviteDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    return error;
  }
}

export { AcceptGroupInviteToUserHttpController };
