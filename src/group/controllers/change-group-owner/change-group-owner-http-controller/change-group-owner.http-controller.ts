import { CustomError } from '@Common/enums/custom-errors';
import { ChangeGroupOwnerCommand } from '@Group/cqrs/commands/change-group-owner.command';
import { ChangeGroupOwnerRequestDto } from '@Group/dtos/requests/change-group-owner-request.dto';
import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { Response } from 'express';
import { Result } from 'oxide.ts';

@Controller()
class ChangeGroupOwnerHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/changeGroupOwner')
  async changeGroupOwner(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: ChangeGroupOwnerRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const changeGroupOwnerCommand = new ChangeGroupOwnerCommand({
      userId: user.id,
      groupId,
      newOwnerId: dto.newOwnerId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      changeGroupOwnerCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    if (error === CustomError.UserDoesNotInGroup) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    if (error === CustomError.UserDoesNotExist) {
      res.status(HttpStatus.BAD_REQUEST);
    }

    return error;
  }
}

export { ChangeGroupOwnerHttpController };
