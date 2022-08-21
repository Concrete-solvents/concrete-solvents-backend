// Libraries
import { IsNumber } from 'class-validator';

class RejectGroupInviteToUserRequestDto {
  @IsNumber()
  inviteId: number;
}

export { RejectGroupInviteToUserRequestDto };
