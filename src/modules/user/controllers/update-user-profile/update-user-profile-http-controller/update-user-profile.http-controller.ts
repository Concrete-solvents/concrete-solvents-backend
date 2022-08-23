// Libraries
import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { User } from '@User/decorators/user.decorator';
import { UpdateUserInfoRequestDto } from '@User/dtos/update-user-info-request.dto';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { UpdateUserInfoCommand } from '@User/cqrs/commands/update-user-info.command';

@Controller()
class UpdateUserProfileHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('user/updateUserInfo')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user info' })
  async updateUserInfo(
    @User() user: UserBaseResponse,
    @Body() updateUserInfoDto: UpdateUserInfoRequestDto,
  ) {
    const updateUserInfoCommand = new UpdateUserInfoCommand({
      userId: user.id,
      username: updateUserInfoDto.username,
      description: updateUserInfoDto.description,
      avatarUrl: updateUserInfoDto.avatarUrl,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      updateUserInfoCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    return result.unwrapErr();
  }
}

export { UpdateUserProfileHttpController };
