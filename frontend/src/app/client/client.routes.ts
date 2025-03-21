import { Routes } from "@angular/router";
import { PerfilComponent } from "./perfil/perfil.component";
import { hasPermission } from "../guards/permission.guard";
import { MetodosPagoComponent } from "./metodos-pago/metodos-pago.component";
import { NuevoMetodoPagoComponent } from "./metodos-pago/nuevo-metodo-pago/nuevo-metodo-pago.component";
import { CarritoComponent } from "./carrito/carrito.component";
import { OrdenesComponent } from "./ordenes/ordenes.component";
import { CrearOrdenComponent } from "./ordenes/crear-orden/crear-orden.component";
import { VerOrdenComponent } from "./ordenes/ver-orden/ver-orden.component";

const routes: Routes = [
  { path: "perfil", component: PerfilComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
  { path: "carrito", component: CarritoComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
  { path: "ordenes", component: OrdenesComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
  { path: "ordenes/nuevo", component: CrearOrdenComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
  { path: "ordenes/:id", component: VerOrdenComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
  { path: "metodos-pago", component: MetodosPagoComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
  { path: "metodos-pago/nuevo", component: NuevoMetodoPagoComponent, data: { roles: ["CLIENTE"] }, canActivate: [hasPermission] },
]

export default routes;