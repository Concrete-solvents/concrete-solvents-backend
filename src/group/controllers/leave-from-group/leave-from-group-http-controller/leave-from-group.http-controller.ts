import { CustomError } from '@Common/enums/custom-errors';
import { LeaveFromGroupCommand } from '@Group/cqrs/commands/leave-from-group.command';
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
class LeaveFromGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/leave')
  async leaveFromGroup(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const leaveFromGroupCommand = new LeaveFromGroupCommand({
      userId: user.id,
      groupId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      leaveFromGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.GroupDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.UserDoesNotInGroup) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.OwnerCantLeaveFromGroup) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { LeaveFromGroupHttpController };
