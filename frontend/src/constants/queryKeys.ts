export const QUERY_KEYS = {
  USER: {
    ME: ['user', 'me'],
    PROFILE: (id: string) => ['user', 'profile', id],
  },
} as const;
