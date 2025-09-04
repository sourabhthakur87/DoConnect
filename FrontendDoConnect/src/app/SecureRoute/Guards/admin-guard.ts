import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth-service';
interface JwtPayload {
  role?: string;
  [key: string]: any;
}
export const adminGuard: CanActivateFn = (route, state) => {
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

    if (role === 'Admin' || role === 1) {
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
