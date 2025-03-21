import { inject } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/auth.types";
import { CanActivateChildFn, CanActivateFn } from "@angular/router";
import { of, switchMap } from "rxjs";

export const hasPermission: CanActivateFn | CanActivateChildFn = (route, state) => {
  // const router: Router = inject(Router);

  return inject(AuthService).user$.pipe(
    switchMap((user: User) => {
      const rolesAdmitidos = route.data["roles"] as string[];
      const hasPermissions = rolesAdmitidos.includes(user.tipoUsuario);
      return of(hasPermissions);
    })
  )  
  
};
