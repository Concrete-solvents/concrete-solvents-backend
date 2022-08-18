import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Result } from 'oxide.ts';
import { ApproveFriendshipRequestCommand } from './approve-friendship-request.command';
import { ApproveFriendshipRequestRequestDto } from './approve-friendship-request.request.dto';

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
