// Group
import { GroupPublicInfo } from '@Group/interfaces/group-public-info.interface';

interface JoinRequest {
  id: number;
  group: GroupPublicInfo;
}

class GetRequestsToJoinGroupSentByUserResponseDto {
  joinRequests: JoinRequest[];
}

export { GetRequestsToJoinGroupSentByUserResponseDto };
