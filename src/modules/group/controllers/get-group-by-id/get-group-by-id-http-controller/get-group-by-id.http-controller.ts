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

// Group
import { GetGroupByIdQuery } from '@Group/cqrs/queries/get-group-by-id.query';
import { GetGroupByIdResponseDto } from '@Group/dtos/responses/get-group-by-id-response.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller()
class GetGroupByIdHttpController {
  constructor(private readonly _queryBus: QueryBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('groups/:groupId')
  async getGroupById(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const getGroupByIdQuery = new GetGroupByIdQuery({
      userId: user.id,
      groupId,
    });

    const result: Result<GetGroupByIdResponseDto, CustomError> =
      await this._queryBus.execute(getGroupByIdQuery);

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    if (error === CustomError.GroupDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { GetGroupByIdHttpController };
