// Libraries
import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

// Common
import { CoreResponse } from '@Common/dtos/core-response.dto';

// Auth
import { BASE_JWT_OPTION } from '@Auth/constants/base-jwt-options.constant';

@Controller()
class LogoutHttpController {
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<CoreResponse> {
    res.cookie('jwt', '', { ...BASE_JWT_OPTION, ...{ maxAge: 1 } });

    return {
      isSuccess: true,
    };
  }
}

export { LogoutHttpController };
