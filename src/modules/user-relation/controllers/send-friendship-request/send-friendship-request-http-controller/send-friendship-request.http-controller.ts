// Libraries
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

// UserRelation
import { SendFriendRequestRequestDto } from '@UserRelation/dtos/requests/send-friend-request.request.dto';
import { SendFriendshipRequestCommand } from '@UserRelation/cqrs/commands/send-friendship-request.command';

@Controller()
class SendFriendshipRequestHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('/users/sendFriendshipRequest')
  @UseGuards(AuthGuard('jwt'))
  sendFriendshipRequest(
    @User() user: UserBaseResponse,
    @Body() dto: SendFriendRequestRequestDto,
  ) {
    const command = new SendFriendshipRequestCommand({
      toUserId: dto.toUserId,
      fromUserId: user.id,
    });

    return this._commandBus.execute(command);
  }
}

export { SendFriendshipRequestHttpController };
