// Libraries
import { IsNumber } from 'class-validator';

class ChangeGroupOwnerRequestDto {
  @IsNumber()
  newOwnerId: number;
}

export { ChangeGroupOwnerRequestDto };
