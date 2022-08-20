import { CustomError } from '@Common/enums/custom-errors';
import { GetReceivedInvitesQuery } from '@GroupInvite/cqrs/queries/get-received-invites.query';
import { GetReceivedInvitesResponseDto } from '@GroupInvite/dtos/responses/get-received-invites-response.dto';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Result } from 'oxide.ts';

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
