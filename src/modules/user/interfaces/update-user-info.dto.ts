import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import {
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from '@User/constants/user-minmax-lengths.constant';

class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  @MinLength(MIN_USERNAME_LENGTH)
  @MaxLength(MAX_USERNAME_LENGTH)
  username?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export { UpdateUserInfoDto };
