interface UserBaseResponse {
  login: string;
  username: string;
  email: string;
  isVerified: boolean;
  id: number;
  avatarUrl: string;
  description: string;
}

export type { UserBaseResponse };
