// Libraries
import { Result } from 'oxide.ts';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// GroupInvite
import { GetReceivedInvitesQuery } from '@GroupInvite/cqrs/queries/get-received-invites.query';
import { GetReceivedInvitesResponseDto } from '@GroupInvite/dtos/responses/get-received-invites-response.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class GetReceivedInvitesHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('groups/receivedInvites')
  async getReceivedInvites(@User() user: UserBaseResponse) {
    const getReceivedInvites = new GetReceivedInvitesQuery({
      userId: user.id,
    });

    const result: Result<GetReceivedInvitesResponseDto, CustomError> =
      await this._queryBus.execute(getReceivedInvites);

    if (result.isOk()) {
      return result.unwrap();
    }

    return result.unwrapErr();
  }
}

export { GetReceivedInvitesHttpController };
