// Libraries
import { Response } from 'express';
import { Result } from 'oxide.ts';
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

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { KickUserFromGroupCommand } from '@Group/cqrs/commands/kick-user-from-group.command';
import { KickUserFromGroupRequestDto } from '@Group/dtos/requests/kick-user-from-group-request.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class KickUserFromGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/kickUser')
  async kickUserFromGroup(
    @User() user: UserBaseResponse,
    @Body() dto: KickUserFromGroupRequestDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const kickUserFromGroupCommand = new KickUserFromGroupCommand({
      groupId,
      userWhoKickId: user.id,
      userToKickId: dto.userToKickId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      kickUserFromGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    if (error === CustomError.UserDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.UserDoesNotInGroup) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { KickUserFromGroupHttpController };
