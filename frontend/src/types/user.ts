export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: keyof UserRole;
  point: number;
  profileImageUrl: string;
  initialized: boolean;
  interests: Array<{
    interestId: number;
    name: string;
  }>;
}


interface UserRole {
  BEGINNER: string;
  INTERMEDIATE: string;
  ADVANCED: string;
}
