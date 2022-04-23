// Auth
import { LoginResponse } from '@Auth/dtos/login-response.dto';

class LoginResponseWithAccessToken extends LoginResponse {
  accessToken: string;
}

export { LoginResponseWithAccessToken };
