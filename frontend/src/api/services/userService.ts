import { client } from '../core/client';
import { API_ENDPOINTS } from '../core/types';
import type { ApiResponse } from '@/types/api';
import type { UserData, UpdateInterestsPayload } from '@/types/user';

export const userService = {
  getUserProfile: async (): Promise<ApiResponse<UserData>> => {
    return client.get(API_ENDPOINTS.USERS.PROFILE);
  },
  updateInterests: async (
    payload: UpdateInterestsPayload,
  ): Promise<ApiResponse<UserData>> => {
    return client.put(API_ENDPOINTS.USERS.INTERESTS, payload);
  },
};