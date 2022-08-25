// Group
import { GroupPublicInfo } from '@Group/interfaces/group-public-info.interface';

// User
import { UserPublicInfo } from '@User/interfaces/user-public-info.interface';
import { UserRelationType } from '@UserRelation/enum/user-relation-type.enum';

interface GroupsPreviewInProfile {
  groups: GroupPublicInfo[];
  countOfGroups: number;
}

interface FriendsPreviewInProfile {
  friends: UserPublicInfo[];
  countOfFriends: number;
}

interface Profile {
  groupsPreview: GroupsPreviewInProfile;
  friendsPreview: FriendsPreviewInProfile;
  userPublicInfo: UserPublicInfo;
  currentUserRelationWithRequestedUser?: UserRelationType;
  relationWithCurrentUser?: UserRelationType;
}

class GetUserProfileResponseDto {
  profile: Profile;
}

export { GetUserProfileResponseDto };
