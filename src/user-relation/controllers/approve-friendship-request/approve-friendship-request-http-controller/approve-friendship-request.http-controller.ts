// Libraries
import { Result } from 'oxide.ts';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

// UserRelation
import { ApproveFriendshipRequestCommand } from '@UserRelation/cqrs/commands/approve-friendship-request.command';
import { ApproveFriendshipRequestRequestDto } from '@UserRelation/dtos/requests/approve-friendship-request.request.dto';

@Controller()
class ApproveFriendshipRequestHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/approveFriendshipRequest')
  @UseGuards(AuthGuard('jwt'))
  async approveFriendshipRequest(
    @User() user: UserBaseResponse,
    @Body() dto: ApproveFriendshipRequestRequestDto,
  ) {
    const command = new ApproveFriendshipRequestCommand({
      toUserId: user.id,
      fromUserId: dto.fromUserId,
    });

    const result: Result<boolean, string> = await this._commandBus.execute(
      command,
    );

    return result.unwrap();
  }
}

export { ApproveFriendshipRequestHttpController };
