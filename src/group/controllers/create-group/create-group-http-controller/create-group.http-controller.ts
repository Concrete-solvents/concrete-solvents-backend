import { CustomError } from '@Common/enums/custom-errors';
import {
  Body,
  Controller,
  HttpStatus,
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
import { CreateGroupCommand } from '@Group/cqrs/commands/create-group.command';
import { CreateGroupRequestDto } from '@Group/dtos/requests/create-group-request.dto';

@Controller()
class CreateGroupHttpController {
  constructor(private readonly _commandBus: CommandBus) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('groups/create')
  async createGroup(
    @User() user: UserBaseResponse,
    @Body() dto: CreateGroupRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const createGroupCommand = new CreateGroupCommand({
      name: dto.name,
      description: dto.description,
      ownerId: user.id,
    });

    const result: Result<boolean, CustomError> = await this._commandBus.execute(
      createGroupCommand,
    );

    if (result.isOk()) {
      return result.unwrap();
    }

    res.status(HttpStatus.CONFLICT);

    return result.unwrapErr();
  }
}

export { CreateGroupHttpController };
