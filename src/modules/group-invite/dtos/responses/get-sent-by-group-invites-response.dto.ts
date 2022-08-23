// User
import { UserPublicInfo } from '@User/interfaces/user-public-info.interface';

interface Invite {
  id: number;
  toUser: UserPublicInfo;
}

class GetSentByGroupInvitesResponseDto {
  invites: Invite[];
}

export { GetSentByGroupInvitesResponseDto };
