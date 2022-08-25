// Libraries
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { Result } from 'oxide.ts';

// Common
import { CustomError } from '@Common/enums/custom-errors';

// Group
import { GetGroupsByUserIdQuery } from '@Group/cqrs/queries/get-groups-by-user-id.query';
import { GetGroupsByUserIdResponseDto } from '@Group/dtos/responses/get-groups-by-user-id-response.dto';

@Controller()
class GetGroupsByUserIdHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @Get('users/:userId/groups')
  async getGroupsByUserId(
    @Param('userId') userId: number,
    @Res({ passthrough: true }) res: Response,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('filter') filter: string,
  ) {
    const getGroupsByUserIdQuery = new GetGroupsByUserIdQuery({
      userId,
      limit,
      page,
      filter,
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
