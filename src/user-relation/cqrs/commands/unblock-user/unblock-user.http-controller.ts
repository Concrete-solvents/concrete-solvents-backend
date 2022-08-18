// Libraries
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'oxide.ts';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { UnblockUserCommand } from './unblock-user.command';
import { UnblockUserRequestDto } from './unblock-user.request.dto';

// User relation

@Controller()
class UnblockUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/unblockUser')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(
    @User() user: UserBaseResponse,
    @Body() dto: UnblockUserRequestDto,
  ) {
    const command = new UnblockUserCommand({
      userId: user.id,
      userToUnblockId: dto.userToUnblockId,
    });

    const result: Result<boolean, string> = await this._commandBus.execute(
      command,
    );

    return result.unwrap();
  }
}

export { UnblockUserHttpController };
