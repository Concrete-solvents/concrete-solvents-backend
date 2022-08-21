// User
import { UserPublicInfo } from '@User/interfaces/user-public-info.interface';

interface joinRequest {
  id: number;
  fromUser: UserPublicInfo;
}

class GetJoinRequestReceivedByGroupResponseDto {
  joinRequests: joinRequest[];
}

export { GetJoinRequestReceivedByGroupResponseDto };
