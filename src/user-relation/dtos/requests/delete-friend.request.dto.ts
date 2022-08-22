// Libraries
import { IsInt } from 'class-validator';

class DeleteFriendRequestDto {
  @IsInt()
  userToDeleteId: number;
}

export { DeleteFriendRequestDto };
