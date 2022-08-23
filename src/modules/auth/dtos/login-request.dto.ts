// Libraries
import { IsEmail, IsOptional, IsString } from 'class-validator';

class LoginRequest {
  @IsString()
  @IsOptional()
  login?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  password: string;
}

export { LoginRequest };
