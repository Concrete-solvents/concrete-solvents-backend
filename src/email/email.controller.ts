// Libraries
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

// Common
import { CoreResponse } from '@Common/dtos/core-response.dto';

// Email
import { EmailService } from '@Email/email.service';
import { SendRestoreCodeRequestDto } from '@Email/dtos/SendRestoreCodeRequest.dto';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller('email')
@ApiTags('Email')
class EmailController {
  constructor(private readonly _emailService: EmailService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('verificationCode')
  sendVerificationCode(@User() user: UserBaseResponse): Promise<CoreResponse> {
    return this._emailService.sendVerificationCode(user);
  }

  @Post('restoreCode')
  sendRestoreCode(
    @Body() sendRestoreCodeDto: SendRestoreCodeRequestDto,
  ): Promise<CoreResponse> {
    return this._emailService.sendRestoreCode(sendRestoreCodeDto);
  }

  @Get('verifyEmail')
  verifyEmail(
    @Query('email') email: string,
    @Query('code') code: string,
  ): Promise<string> {
    return this._emailService.verifyEmail(email, code);
  }
}

export { EmailController };
