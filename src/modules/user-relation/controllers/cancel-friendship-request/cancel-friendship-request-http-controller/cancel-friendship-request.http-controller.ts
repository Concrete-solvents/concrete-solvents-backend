// Libraries
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
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

// UserRelation
import { CancelFriendshipRequestCommand } from '@UserRelation/cqrs/commands/cancel-friendship-request.command';
import { CancelFriendshipRequestRequestDto } from '@UserRelation/dtos/requests/cancel-friendship-request.request.dto';

@Controller()
class CancelFriendshipRequestHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/cancelFriendshipRequest')
  @UseGuards(AuthGuard('jwt'))
  async cancelFriendshipRequest(
    @User() user: UserBaseResponse,
    @Body() dto: CancelFriendshipRequestRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new CancelFriendshipRequestCommand({
      userId: user.id,
      toUserId: dto.toUserId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      command,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.RequestDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { CancelFriendshipRequestHttpController };
