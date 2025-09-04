import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const authSevice = inject(AuthService);
  const router = inject(Router);

  const token = authSevice.getToken();

  if (!token) {
    router.navigate(["/"]);
    return false;
  }

  return true;
};
