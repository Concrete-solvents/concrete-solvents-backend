// Common
import { CoreResponse } from '@Common/dtos/core-response.dto';

// User
import { UserBaseResponse } from '@User/interfaces/user-base-response.interface';

class LoginResponse extends CoreResponse {
  user?: UserBaseResponse;
}

export { LoginResponse };
