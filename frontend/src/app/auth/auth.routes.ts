import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SetPasswordComponent } from "./set-password/set-password.component";
import { noAuthGuard } from "../guards/no-auth.guard";

const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [noAuthGuard] },
  { path: "register", component: RegisterComponent, canActivate: [noAuthGuard] },
  { path: "forgot-password", component: ForgotPasswordComponent, canActivate: [noAuthGuard] },
  { path: "recovery/:idCliente", component: SetPasswordComponent, canActivate: [noAuthGuard] },
  { path: "**", redirectTo: "login" },
];

export default routes;