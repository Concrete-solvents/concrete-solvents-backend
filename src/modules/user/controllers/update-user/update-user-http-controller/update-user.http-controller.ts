// Libraries
import { Result } from 'oxide.ts';
import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { UpdateUserCommand } from '@User/cqrs/commands/update-user.command';
import { User } from '@User/decorators/user.decorator';
import { UpdateUserRequestDto } from '@User/interfaces/update-user-request.dto';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class UpdateUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('user/update')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @User() user: UserBaseResponse,
    @Body() dto: UpdateUserRequestDto,
  ) {
    const updateUserCommand = new UpdateUserCommand({
      userId: user.id,
      email: dto.email,
      newPassword: dto.newPassword,
      oldPassword: dto.oldPassword,
      username: dto.username,
      avatarUrl: dto.avatarUrl,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      updateUserCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    return result.unwrapErr();
  }
}

export { UpdateUserHttpController };
