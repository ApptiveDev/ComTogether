export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: 'BEGINNER' | 'EXPERT';  // DB 스키마에 맞게 수정
  point: number;
  profileImageUrl: string;
  initialized: boolean;
  interests: Array<{
    interestId: number;
    name: string;
  }>;
}

// UserRole 인터페이스는 제거하고 직접 유니온 타입 사용
export type UserRoleType = 'BEGINNER' | 'EXPERT';

// 기본 export 추가
export default UserData;
