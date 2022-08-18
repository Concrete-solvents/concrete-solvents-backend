import { IsInt } from 'class-validator';

class SendFriendRequestRequestDto {
  @IsInt()
  toUserId: number;
}

export { SendFriendRequestRequestDto };
