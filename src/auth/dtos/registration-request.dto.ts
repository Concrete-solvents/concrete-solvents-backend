// Libraries
import {
  IsEmail, IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// Settings
import { Languages } from '@Settings/enums/languages.enum';

// User
import {
  MAX_LOGIN_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_LOGIN_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@User/constants/user-minmax-lengths.constant';

class RegistrationRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_LOGIN_LENGTH)
  @MaxLength(MAX_LOGIN_LENGTH)
  login: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;

  @IsEnum(Languages)
  language: Languages;
}

export { RegistrationRequest };
