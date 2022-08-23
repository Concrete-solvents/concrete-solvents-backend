// Libraries
import { IsInt } from 'class-validator';

class ApproveFriendshipRequestRequestDto {
  @IsInt()
  fromUserId: number;
}

export { ApproveFriendshipRequestRequestDto };
