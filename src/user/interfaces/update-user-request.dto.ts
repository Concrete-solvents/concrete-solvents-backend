// Libraries
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// User
import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
} from '@User/constants/user-minmax-lengths.constant';

class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  @MinLength(MIN_USERNAME_LENGTH)
  @MaxLength(MAX_USERNAME_LENGTH)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  @IsOptional()
  newPassword?: string;

  @IsString()
  @IsOptional()
  oldPassword?: string;
}

export { UpdateUserRequestDto };
