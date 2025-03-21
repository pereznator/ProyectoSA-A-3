import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: "auth", loadChildren: () => import("./auth/auth.routes") },
  { path: "cliente", canActivate: [authGuard], canActivateChild: [authGuard], loadChildren: () => import("./client/client.routes") },
  { path: "admin", canActivate: [authGuard], canActivateChild: [authGuard], loadChildren: () => import("./admin/admin.routes") },
  { path: "", loadChildren: () => import("./main/main.routes") },
  { path: "**", redirectTo: "auth" }
];
