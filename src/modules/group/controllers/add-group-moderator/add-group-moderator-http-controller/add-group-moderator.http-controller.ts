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
import { AddGroupModeratorCommand } from '@Group/cqrs/commands/add-group-moderator.command';
import { AddGroupModeratorRequestDto } from '@Group/dtos/requests/add-group-moderator-request.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class AddGroupModeratorHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/addModerator')
  async addGroupModerator(
    @User() user: UserBaseResponse,
    @Body() dto: AddGroupModeratorRequestDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const addGroupModeratorCommand = new AddGroupModeratorCommand({
      userId: user.id,
      newModeratorUserId: dto.newModeratorUserId,
      groupId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      addGroupModeratorCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    if (error === CustomError.UserAlreadyModerator) {
      res.status(HttpStatus.CONFLICT);
    }

    if (error === CustomError.UserDoesNotInGroup) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { AddGroupModeratorHttpController };
