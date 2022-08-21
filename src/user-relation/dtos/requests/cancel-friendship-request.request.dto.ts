// Libraries
import { IsInt } from 'class-validator';

class CancelFriendshipRequestRequestDto {
  @IsInt()
  toUserId: number;
}

export { CancelFriendshipRequestRequestDto };
