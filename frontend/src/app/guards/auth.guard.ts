import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);

  return inject(AuthService).check().pipe(
    switchMap((authenticated) => {
      if (!authenticated) {
        router.navigate(["auth", "login"])
        return of(false);
      }
      // Allow the access
      return of(true);
    }),
  );
};
