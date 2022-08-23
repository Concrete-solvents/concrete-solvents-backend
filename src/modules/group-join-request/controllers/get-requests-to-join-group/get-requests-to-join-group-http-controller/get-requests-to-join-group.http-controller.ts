// Libraries
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupJoinRequest
import { GetRequestsToJoinGroupSentByUserQuery } from '@GroupJoinRequest/cqrs/quieries/get-requests-to-join-group-sent-by-user.query';
import { GetRequestsToJoinGroupSentByUserResponseDto } from '@GroupJoinRequest/dtos/responses/get-requests-to-join-group-sent-by-user-response.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class GetRequestsToJoinGroupHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('groups/getRequestsToJoinGroupSentByUser')
  async getRequestsToJoinGroupSentByUser(@User() user: UserBaseResponse) {
    const getRequestsToJoinGroupSentByUserQuery =
      new GetRequestsToJoinGroupSentByUserQuery({
        userId: user.id,
      });

    const result: Result<
      GetRequestsToJoinGroupSentByUserResponseDto,
      CustomError
    > = await this._queryBus.execute(getRequestsToJoinGroupSentByUserQuery);

    if (result.isOk()) {
      return result.unwrap();
    }

    return result.unwrapErr();
  }
}

export { GetRequestsToJoinGroupHttpController };
