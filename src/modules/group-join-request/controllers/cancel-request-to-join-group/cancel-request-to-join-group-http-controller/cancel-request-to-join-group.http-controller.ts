import { CustomError } from '@Common/enums/custom-errors';
import { CancelRequestToJoinGroupCommand } from '@GroupJoinRequest/cqrs/commands/cancel-request-to-join-group.command';
import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Result } from 'oxide.ts';

@Controller()
class CancelRequestToJoinGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/cancelJoinRequest')
  async cancelRequestToJoinGroup(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    const cancelRequestToJoinGroupCommand = new CancelRequestToJoinGroupCommand(
      {
        userId: user.id,
        groupId,
      },
    );

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      cancelRequestToJoinGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    return result.unwrapErr();
  }
}

export { CancelRequestToJoinGroupHttpController };
