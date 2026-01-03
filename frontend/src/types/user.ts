export type UserRoleType = 'BEGINNER' | 'EXPERT';

export type SetupStep = 'NOT_STARTED' | 'CERTIFICATION_UPLOADED' | 'COMPLETED';

export interface UserInterest {
  interestId: number;
  name: string;
}

export interface UpdateInterestsPayload {
  interest_ids?: number[];
  custom_interests?: string[];
}

export interface UserData {
  userId: number;
  name: string;
  email: string;
  role: UserRoleType | 'ADMIN';
  point: number;
  profile_image_url: string | null;
  setup_step: SetupStep;
  interests: UserInterest[];
  created_at?: string;
}
