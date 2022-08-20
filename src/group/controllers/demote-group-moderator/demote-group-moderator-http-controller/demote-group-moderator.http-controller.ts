import { CustomError } from '@Common/enums/custom-errors';
import { DemoteGroupModeratorCommand } from '@Group/cqrs/commands/demote-group-moderator.command';
import { DemoteGroupModeratorRequestDto } from '@Group/dtos/requests/demote-group-moderator-request.dto';
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
class DemoteGroupModeratorHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/demoteModerator')
  async demoteGroupModerator(
    @User() user: UserBaseResponse,
    @Body() dto: DemoteGroupModeratorRequestDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const demoteGroupModeratorCommand = new DemoteGroupModeratorCommand({
      userId: user.id,
      userIdToDemote: dto.userToDemoteId,
      groupId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      demoteGroupModeratorCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    if (error === CustomError.UserNotModerator) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.UserDoesNotInGroup) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { DemoteGroupModeratorHttpController };
