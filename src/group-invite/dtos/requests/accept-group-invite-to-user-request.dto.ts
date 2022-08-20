import { IsNumber } from 'class-validator';

class AcceptGroupInviteToUserRequestDto {
  @IsNumber()
  inviteId: number;
}

export { AcceptGroupInviteToUserRequestDto };
