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

// GroupInvite
import { GetSentByGroupInvitesQuery } from '@GroupInvite/cqrs/queries/get-sent-by-group-invites.query';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class GetSentByGroupInvitesHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('groups/:groupId/getSentInvites')
  async getSentByGroupInvites(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const getSentByGroupInvitesQuery = new GetSentByGroupInvitesQuery({
      userId: user.id,
      groupId,
    });

    const result: Result<any, CustomError> = await this._queryBus.execute(
      getSentByGroupInvitesQuery,
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

export { GetSentByGroupInvitesHttpController };
