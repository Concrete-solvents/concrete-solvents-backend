// Libraries
import { Response } from 'express';
import { Result } from 'oxide.ts';
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

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupJoinRequest
import { GetJoinRequestReceivedByGroupQuery } from '@GroupJoinRequest/cqrs/quieries/get-join-request-received-by-group.query';
import { GetJoinRequestReceivedByGroupResponseDto } from '@GroupJoinRequest/dtos/responses/get-join-request-received-by-group-response.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class GetJoinRequestReceivedByGroupHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('groups/:groupId/getRequestsToJoinGroupReceivedByGroup')
  async getRequestsToJoinGroupReceivedByGroup(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const getRequestsToJoinGroupReceivedByGroupQuery =
      new GetJoinRequestReceivedByGroupQuery({
        userId: user.id,
        groupId,
      });

    const result: Result<
      GetJoinRequestReceivedByGroupResponseDto,
      CustomError
    > = await this._queryBus.execute(
      getRequestsToJoinGroupReceivedByGroupQuery,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    return error;
  }
}

export { GetJoinRequestReceivedByGroupHttpController };
