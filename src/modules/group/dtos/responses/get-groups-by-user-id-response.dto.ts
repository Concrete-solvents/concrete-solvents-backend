// Group
import { GroupPublicInfo } from '@Group/interfaces/group-public-info.interface';

class GetGroupsByUserIdResponseDto {
  groups: GroupPublicInfo[];
  totalPages: number;
}

export { GetGroupsByUserIdResponseDto };
