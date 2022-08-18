// Libraries
import { IsInt } from 'class-validator';

class UnblockUserRequestDto {
  @IsInt()
  userToUnblockId: number;
}

export { UnblockUserRequestDto };
