import { client } from '../core/client';
import { API_ENDPOINTS } from '../core/types';
import type { ApiResponse } from '@/types/api';
import type { UserData } from '@/types/user';

export const userService = {
  getUserProfile: async (): Promise<ApiResponse<UserData>> => {
    return client.get(API_ENDPOINTS.USERS.PROFILE);
  },
};