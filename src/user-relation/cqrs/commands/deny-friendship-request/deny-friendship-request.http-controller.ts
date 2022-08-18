import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Result } from 'oxide.ts';
import { DenyFriendshipRequestCommand } from './deny-friendship-request.command';
import { DenyFriendshipRequestRequestDto } from './deny-friendship-request.request.dto';

@Controller()
class DenyFriendshipRequestHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/denyFriendshipRequest')
  @UseGuards(AuthGuard('jwt'))
  async cancelFriendshipRequest(
    @User() user: UserBaseResponse,
    @Body() dto: DenyFriendshipRequestRequestDto,
  ) {
    const command = new DenyFriendshipRequestCommand({
      userId: user.id,
      fromUserId: dto.fromUserId,
    });

    const result: Result<boolean, string> = await this._commandBus.execute(
      command,
    );

    return result.unwrap();
  }
}

export { DenyFriendshipRequestHttpController };
