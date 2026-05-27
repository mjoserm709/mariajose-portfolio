import { HttpInterceptorFn } from '@angular/common/http';
import { BACKEND_API_ORIGIN } from './api.config';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('portfolio_access_token');
  const isApiRequest = request.url.startsWith('/api') || request.url.startsWith(`${BACKEND_API_ORIGIN}/api`);

  if (!token || !isApiRequest) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
