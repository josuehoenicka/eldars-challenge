import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  if (token) {
    authService.isAuthSignal.set(true);
    return true;
  } else {
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
};
