const fallbackApiUrl = 'http://localhost:4000/api/v1';

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? fallbackApiUrl,
};
