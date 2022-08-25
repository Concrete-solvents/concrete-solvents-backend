// Libraries
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { GetUserProfileQuery } from '@User/cqrs/queries/get-user-profile.query';
import { GetUserProfileResponseDto } from '@User/dtos/responses/get-user-profile-response.dto';

@Controller()
class GetUserProfileHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('users/:userId/profile')
  async getUserProfile(
    @User() user: UserBaseResponse,
    @Param('userId', ParseIntPipe) userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const getUserProfileQuery = new GetUserProfileQuery({
      userId,
      currentUser: user.id,
    });

    const result: Result<GetUserProfileResponseDto, CustomError> =
      await this._queryBus.execute(getUserProfileQuery);

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.UserDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return result.unwrapErr();
  }
}

export { GetUserProfileHttpController };
