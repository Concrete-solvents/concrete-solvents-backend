import { IsNumber } from 'class-validator';

class DemoteGroupModeratorRequestDto {
  @IsNumber()
  userToDemoteId: number;
}

export { DemoteGroupModeratorRequestDto };
