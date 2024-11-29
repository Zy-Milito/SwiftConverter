import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if(authService.claims?.isAdmin) return true;
  if (authService.user?.isAdmin) return true;
  const url = router.parseUrl('/home');

  return new RedirectCommand(url);
};
