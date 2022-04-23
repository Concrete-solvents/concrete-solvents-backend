// Libraries
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// User
import { User } from '@User/decorators/user.decorator';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

@Controller('user')
@ApiTags('User')
class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user information from a token' })
  getProfile(@User() user: UserBaseResponse): UserBaseResponse {
    return user;
  }
}

export { UserController };
