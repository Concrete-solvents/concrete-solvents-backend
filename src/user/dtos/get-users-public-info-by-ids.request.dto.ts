import { IsInt } from 'class-validator';

class GetUsersPublicInfoByIdsRequestDto {
  @IsInt({ each: true })
  userIds: number[];
}

export { GetUsersPublicInfoByIdsRequestDto };
