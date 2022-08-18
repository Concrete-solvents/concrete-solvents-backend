import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Result } from 'oxide.ts';
import { CancelFriendshipRequestCommand } from './cancel-friendship-request.command';
import { CancelFriendshipRequestRequestDto } from './cancel-friendship-request.request.dto';

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
