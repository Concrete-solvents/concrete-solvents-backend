import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { match, Result } from 'oxide.ts';
import { GetUserRelationsQuery } from '../../cqrs/queries/get-user-relations/get-user-relations.query';

@Controller()
class GetUserRelationsHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('users/:id/relations')
  async getUserRelations(
    @User() user: UserBaseResponse,
    @Param('id', ParseIntPipe) givenUserId: number,
  ) {
    const query = new GetUserRelationsQuery({
      givenUserId,
      currentUserId: user.id,
    });

    const result: Result<any, string> = await this._queryBus.execute(query);

    return match(result, {
      Ok: () => result.unwrap(),
      Err: () => 'Error',
    });
  }
}

export { GetUserRelationsHttpController };
