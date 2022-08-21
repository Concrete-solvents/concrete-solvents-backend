// Libraries
import { IsInt } from 'class-validator';

class BlockUserRequestDto {
  @IsInt()
  userToBlockId: number;
}

export { BlockUserRequestDto };
