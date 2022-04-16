// Libraries
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// User
import { UserIdAndUsername } from '@User/interfaces/user-id-and-username.interface';
import { User } from '@User/decorators/user.decorator';

@Controller('user')
@ApiTags('User')
class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user info from token' })
  getProfile(@User() user: UserIdAndUsername) {
    return user.username;
  }
}

export { UserController };
