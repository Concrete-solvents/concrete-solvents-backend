import { CustomError } from '@Common/enums/custom-errors';
import { EditGroupCommand } from '@Group/cqrs/commands/edit-group.command';
import { EditGroupRequestDto } from '@Group/dtos/requests/edit-group-request.dto';
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
class EditGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/:groupId/edit')
  async editGroup(
    @User() user: UserBaseResponse,
    @Body() dto: EditGroupRequestDto,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const editGroupCommand = new EditGroupCommand({
      name: dto.name,
      description: dto.description,
      avatarUrl: dto.avatarUrl,
      userId: user.id,
      groupId,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      editGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    const error = result.unwrapErr();

    if (error === CustomError.PermissionError) {
      res.status(HttpStatus.FORBIDDEN);
    }

    if (error === CustomError.GroupNameAlreadyBusy) {
      res.status(HttpStatus.CONFLICT);
    }

    return error;
  }
}

export { EditGroupHttpController };
