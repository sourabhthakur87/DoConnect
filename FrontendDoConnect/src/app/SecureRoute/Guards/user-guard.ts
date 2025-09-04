import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  role?: string;
  [key: string]: any;
}

export const userGuard: CanActivateFn = (route, state) => {
   const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    router.navigate(["/"]);
    return false;
  }

  try {
    const gettokendata: JwtPayload = jwtDecode(token);

    const role =
      gettokendata.role ||
      gettokendata[
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];

    if (role === 'User' || role === 0) {
      return true;
    }
    router.navigate(['/']);
    return false;
  }
  catch (err) {
    console.log(err);
    router.navigate(["/"]);
    return false
  }
};
