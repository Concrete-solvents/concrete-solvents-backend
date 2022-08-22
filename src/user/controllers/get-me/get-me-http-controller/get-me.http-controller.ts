// Libraries
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

// User
import { GetMeQuery } from '@User/cqrs/queries/get-me.query';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class GetMeHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('user/me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user information from a token' })
  async getProfile(@User() user: UserBaseResponse): Promise<UserBaseResponse> {
    const getMeQuery = new GetMeQuery({
      userId: user.id,
    });

    return await this._queryBus.execute(getMeQuery);
  }
}

export { GetMeHttpController };
