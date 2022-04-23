import { RegistrationResponse } from '@Auth/dtos/registration-response.dto';

class RegistrationResponseWithAccessToken extends RegistrationResponse {
  accessToken: string;
}

export { RegistrationResponseWithAccessToken };
