// Libraries
import { IsEmail, IsNotEmpty } from 'class-validator';

class SendAccountRestoreCodeRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export { SendAccountRestoreCodeRequestDto };
