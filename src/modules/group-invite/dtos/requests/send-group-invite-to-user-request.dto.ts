// Libraries
import { IsNumber } from 'class-validator';

class SendGroupInviteToUserRequestDto {
  @IsNumber()
  sentToUserId: number;
}

export { SendGroupInviteToUserRequestDto };
