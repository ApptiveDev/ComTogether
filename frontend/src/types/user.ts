export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: 'BEGINNER' | 'EXPERT';
  point: number;
  profile_image_url: string;
  initialized: boolean;
  interests: Array<{
    interestId: number;
    name: string;
  }>;
}
export type UserRoleType = 'BEGINNER' | 'EXPERT';
