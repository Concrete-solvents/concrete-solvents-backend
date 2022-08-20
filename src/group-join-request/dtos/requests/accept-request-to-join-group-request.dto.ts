import { IsNumber } from 'class-validator';

class AcceptRequestToJoinGroupRequestDto {
  @IsNumber()
  joinRequestId: number;
}

export { AcceptRequestToJoinGroupRequestDto };
