import { IsNumber } from 'class-validator';

class RejectRequestToJoinGroupRequestDto {
  @IsNumber()
  joinRequestId: number;
}

export { RejectRequestToJoinGroupRequestDto };
