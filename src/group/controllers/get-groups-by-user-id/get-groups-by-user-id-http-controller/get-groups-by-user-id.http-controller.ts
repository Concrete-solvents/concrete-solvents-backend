import { CustomError } from '@Common/enums/custom-errors';
import { GetGroupsByUserIdQuery } from '@Group/cqrs/queries/get-groups-by-user-id.query';
import { GetGroupsByUserIdResponseDto } from '@Group/dtos/responses/get-groups-by-user-id-response.dto';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { Result } from 'oxide.ts';

@Controller()
class GetGroupsByUserIdHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get('users/:userId/groups')
  async getGroupsByUserId(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const getGroupsByUserIdQuery = new GetGroupsByUserIdQuery({
      userId,
    });

    const result: Result<GetGroupsByUserIdResponseDto, CustomError> =
      await this._queryBus.execute(getGroupsByUserIdQuery);

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.UserDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { GetGroupsByUserIdHttpController };
