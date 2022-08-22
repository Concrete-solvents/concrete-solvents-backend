// Libraries
import { CustomError } from '@Common/enums/custom-errors';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// User
import { User } from '@User/decorators/user.decorator';
import { UpdateUserRequestDto } from '@User/interfaces/update-user-request.dto';
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';
import { UserService } from '@User/user.service';
import { UpdateUserInfoDto } from "@User/interfaces/update-user-info.dto";

@Controller('user')
@ApiTags('User')
class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user information from a token' })
  getProfile(@User() user: UserBaseResponse): Promise<UserBaseResponse> {
    return this._userService.getMe(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user' })
  updateUser(
    @User() user: UserBaseResponse,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<{ error: CustomError; isSuccess: boolean } | { error: CustomError; isSuccess: boolean } | { error: CustomError; isSuccess: boolean } | { user: { avatarUrl: string; isVerified: boolean; login: string; email: string; username: string }; isSuccess: boolean }> {
    return this._userService.updateUser(user, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('updateUserInfo')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user info' })
  updateUserInfo(
    @User() user: UserBaseResponse,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<{ error: CustomError; isSuccess: boolean} | { avatarUrl: string; isVerified: boolean; login: string; email: string; username: string, description: string }> {
    return this._userService.updateUserInfo(user, updateUserInfoDto);
  }
}

export { UserController };
