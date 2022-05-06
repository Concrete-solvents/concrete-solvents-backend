// Libraries
import { IsEmail, IsNotEmpty } from 'class-validator';

class SendRestoreCodeRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export { SendRestoreCodeRequestDto };
