// libraries
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'oxide.ts';

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
  ) {
    const command = new CancelFriendshipRequestCommand({
      userId: user.id,
      toUserId: dto.toUserId,
    });

    const result: Result<boolean, string> = await this._commandBus.execute(
      command,
    );

    return result.unwrap();
  }
}

export { CancelFriendshipRequestHttpController };
