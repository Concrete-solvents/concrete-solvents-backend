// Libraries
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'oxide.ts';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

// User relation
import { BlockUserCommand } from './block-user.command';
import { BlockUserRequestDto } from './block-user.request.dto';

@Controller()
class BlockUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/blockUser')
  @UseGuards(AuthGuard('jwt'))
  async blockUser(@User() user: UserBaseResponse, @Body() dto: BlockUserRequestDto) {
    const command = new BlockUserCommand({
      userId: user.id,
      userToBlockId: dto.userToBlockId,
    });

    const result: Result<boolean, string> = await this._commandBus.execute(
      command,
    );

    return result.unwrap();
  }
}

export { BlockUserHttpController };
