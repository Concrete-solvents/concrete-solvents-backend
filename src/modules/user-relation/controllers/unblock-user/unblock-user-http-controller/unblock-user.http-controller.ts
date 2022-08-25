// Libraries
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

// UserRelation
import { UnblockUserCommand } from '@UserRelation/cqrs/commands/unblock-user.command';
import { UnblockUserRequestDto } from '@UserRelation/dtos/requests/unblock-user.request.dto';

@Controller()
class UnblockUserHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @Post('users/unblockUser')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'You unblock the user with the given id',
  })
  @ApiResponse({
    description: 'The user does not exist or you are not blocking the user',
    status: HttpStatus.BAD_REQUEST,
    type: CustomError.YouNotBlockingUser,
  })
  @ApiResponse({
    description: 'User unblocked',
    status: HttpStatus.OK,
    type: Boolean,
  })
  async blockUser(
    @User() user: UserBaseResponse,
    @Body() dto: UnblockUserRequestDto,
    @Res() res: Response,
  ) {
    const command = new UnblockUserCommand({
      userId: user.id,
      userToUnblockId: dto.userToUnblockId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      command,
    );

    if (result.isOk()) {
      res.status(HttpStatus.OK);
      return result.unwrap();
    }

    res.status(HttpStatus.BAD_REQUEST);
    const error = result.unwrapErr();

    if (error === CustomError.YouNotBlockingUser) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { UnblockUserHttpController };
