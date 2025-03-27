import { Routes } from "@angular/router";
import { NuevoEmpleadoComponent } from "./empleados/nuevo-empleado/nuevo-usuario.component";
import { EditarEmpleadoComponent } from "./empleados/editar-empleado/editar-usuario.component";
import { UsuariosComponent } from "./empleados/usuarios.component";
import { hasPermission } from "../guards/permission.guard";
import { ProductosComponent } from "./productos/productos.component";
import { NuevoProductoComponent } from "./productos/nuevo-producto/nuevo-producto.component";
import { EditarProductoComponent } from "./productos/editar-producto/editar-producto.component";
import { ProveedoresComponent } from "./proveedores/proveedores.component";
import { ClientesComponent } from "./clientes/clientes.component";
import { MercaderiaComponent } from "./productos/mercaderia/mercaderia.component";
import { PedidosComponent } from "./pedidos/pedidos.component";
import { OfertasComponent } from "./productos/ofertas/ofertas.component";
import { VerPedidoComponent } from "./pedidos/ver-pedido/ver-pedido.component";
import { UsuariosReportadosComponent } from "./empleados/reportados/reportados.component";

const routes: Routes = [
  { path: "proveedores", component: ProveedoresComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "productos", component: ProductosComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "productos/nuevo", component: NuevoProductoComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "productos/ofertas", component: OfertasComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "productos/:idProducto", component: EditarProductoComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "productos/:idProducto/mercaderia", component: MercaderiaComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "pedidos", component: PedidosComponent, data: { roles: ["admin", "moderator"] }, canActivate: [hasPermission] },
  { path: "pedidos/:id", component: VerPedidoComponent, data: { roles: ["admin", "moderator"] }, canActivate: [hasPermission] },
  { path: "clientes", component: ClientesComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "usuarios", component: UsuariosComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "usuarios/nuevo", component: NuevoEmpleadoComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "usuarios/reportados", component: UsuariosReportadosComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "usuarios/:idUsuario", component: EditarEmpleadoComponent, data: { roles: ["admin"] }, canActivate: [hasPermission] },
  { path: "**", redirectTo: "empleados" }
];

export default routes;