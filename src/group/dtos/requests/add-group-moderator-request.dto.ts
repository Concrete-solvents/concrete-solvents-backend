import { IsNumber } from 'class-validator';

class AddGroupModeratorRequestDto {
  @IsNumber()
  newModeratorUserId: number;
}

export { AddGroupModeratorRequestDto };
