import { IsNumber } from 'class-validator';

class CancelGroupInviteToUserRequestDto {
  @IsNumber()
  inviteId: number;
}

export { CancelGroupInviteToUserRequestDto };
