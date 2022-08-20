import { CustomError } from '@Common/enums/custom-errors';
import { DeleteGroupCommand } from '@Group/cqrs/commands/delete-group.command';
import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
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
class DeleteGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete('groups/:groupId')
  async deleteGroup(
    @User() user: UserBaseResponse,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deleteGroupCommand = new DeleteGroupCommand({
      userId: user.id,
      groupId: groupId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      deleteGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);

      return error;
    }

    res.status(HttpStatus.BAD_REQUEST);

    return error;
  }
}

export { DeleteGroupHttpController };
