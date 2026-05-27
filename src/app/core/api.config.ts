export const BACKEND_API_ORIGIN = 'https://mariajose-portfolio.onrender.com';
export const API_BASE_URL = window.location.host.includes('localhost')
  ? '/api'
  : `${BACKEND_API_ORIGIN}/api`;

export function isApiUrl(url: string) {
  return url.startsWith('/api') || url.startsWith(`${BACKEND_API_ORIGIN}/api`);
}
