interface UserBaseResponse {
  login: string;
  username: string;
  email: string;
  isVerified: boolean;
  id: number;
  avatarUrl: string;
}

export type { UserBaseResponse };
