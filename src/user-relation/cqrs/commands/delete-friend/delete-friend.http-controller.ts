// Libraries
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'oxide.ts';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

// User relation
import { DeleteFriendCommand } from './delete-friend.command';
import { DeleteFriendRequestDto } from './delete-friend.request.dto';

@Controller()
class DeleteFriendHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/deleteFriend')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(
    @User() user: UserBaseResponse,
    @Body() dto: DeleteFriendRequestDto,
  ) {
    const command = new DeleteFriendCommand({
      userId: user.id,
      userToDeleteId: dto.userToDeleteId,
    });

    const result: Result<boolean, string> = await this._commandBus.execute(
      command,
    );

    return result.unwrap();
  }
}

export { DeleteFriendHttpController };
