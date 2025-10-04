export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: 'BEGINNER' | 'EXPERT';
  point: number;
  profileImageUrl: string;
  initialized: boolean;
  interests: Array<{
    interestId: number;
    name: string;
  }>;
}
export type UserRoleType = 'BEGINNER' | 'EXPERT';

// export default UserData; // 타입만 있으므로 default export 제거
