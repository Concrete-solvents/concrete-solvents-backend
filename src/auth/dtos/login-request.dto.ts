// Libraries
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// User
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from '@User/constants/user-minmax-lengths.constant';

class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_USERNAME_LENGTH)
  @MaxLength(MAX_USERNAME_LENGTH)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;
}

export { LoginRequest };
