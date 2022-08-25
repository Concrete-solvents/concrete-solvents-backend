interface PublicGroupInfo {
  name: string;
  description: string;
  id: number;
  avatarUrl: string;
  countOfUsers: number;
  type: string;
}

class GetGroupByIdResponseDto {
  group: PublicGroupInfo;
}

export { GetGroupByIdResponseDto };
