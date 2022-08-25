// Libraries
import { Result } from 'oxide.ts';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// User
import { GetUserByIdQuery } from '@User/cqrs/queries/get-user-by-id.query';

@Controller()
class GetUserByIdHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get('users/:userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number) {
    const getUserByIdQuery = new GetUserByIdQuery({
      userId,
    });

    const result: Result<any, CustomError> = await this._queryBus.execute(
      getUserByIdQuery,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    return result.unwrapErr();
  }
}

export { GetUserByIdHttpController };
