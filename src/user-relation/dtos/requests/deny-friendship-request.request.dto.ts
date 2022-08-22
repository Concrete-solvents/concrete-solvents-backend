// Libraries
import { IsInt } from 'class-validator';

class DenyFriendshipRequestRequestDto {
  @IsInt()
  fromUserId: number;
}

export { DenyFriendshipRequestRequestDto };
