import { IsNumber } from 'class-validator';

class KickUserFromGroupRequestDto {
  @IsNumber()
  userToKickId: number;
}

export { KickUserFromGroupRequestDto };
