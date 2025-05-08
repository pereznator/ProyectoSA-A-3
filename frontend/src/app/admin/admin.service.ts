import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, RequestMethod } from '../http.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  authServerUrl = environment.authServerUrl;
  productServerUrl = environment.productServerUrl;
  orderServiceUrl = environment.orderServiceUrl;

  constructor(private httpService: HttpService) { }

  crearCategoria(categoria: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/categoria_producto", categoria);
  }

  crearProveedor(proveedor: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/proveedor", proveedor);
  }

  obtenerProveedores(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, "/proveedor");
  }

  eliminarProveedor(idProveedor: number): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `/proveedor/${idProveedor}`);
  }

  obtenerProductos(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.productServerUrl}/api/product/obtener-productos`);
  }

  obtenerProductoPorId(idProducto: string): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `/producto/view/${idProducto}`);
  }

  actualizarProducto(idProducto: number, producto: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `/producto/${idProducto}`, producto);
  }

  eliminarProducto(idProducto: number): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `/producto/${idProducto}`);
  }

  obtenerClientes(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, "/cliente");
  }

  crearIngresoMercaderia(): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/ingreso_mercaderia");
  }

  crearEgreso(egresoBody: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `/egreso`, egresoBody);
  }

  crearBulkExistencias(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/existencia/bulk", body);
  }

  getMercaderiaPorProductoId(idProducto: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `/ingreso_mercaderia/producto/${idProducto}`);
  }

  obtenerPedidos(params: any): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/orders/obtenerTodasOrdenes`, {}, params);
  }

  actualizarPedido(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `${this.orderServiceUrl}/api/orders/actualizarSeguimientoPedido`, body);
  }

  obtenerSeguimientoPedido(idOrden: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/orders/obtenerSeguimientoPedido/${idOrden}`);
  }

  crearValidacionPago(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/validacion_pago", body);
  }
  crearOferta(oferta: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.authServerUrl}/api/promotion/crear-promocion`, oferta);
  }

  obtenerOfertas(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.authServerUrl}/api/promotion/obtener-todas-promociones`);
  }
  actualizarOferta(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `${this.authServerUrl}/api/promotion/actualizar-promocion`, body);
  }
  eliminarOferta(idOferta: any): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `${this.authServerUrl}/api/promotion/eliminar-promocion/${idOferta}`);
  }
  obtenerOfertasDeUsuario(idUsuario: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.authServerUrl}/api/promotion/obtener-promociones/${idUsuario}`);
  }
  asignarOferta(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.authServerUrl}/api/promotion/asignar-promocion`, body);
  }
  aplicarOferta(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.authServerUrl}/api/promotion/aplicar-promocion`, body);
  }

  obtenerUsuarios(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.authServerUrl}/api/user/obtener-usuarios-no-admin`);
  }
  obtenerUsuarioPorId(idUsuario: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.authServerUrl}/api/user/obtener-usuario-por-id/${idUsuario}`);
  }

  reportarUsuario(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.authServerUrl}/api/user/reportar-usuario`, body);
  }

  obtenerReportados(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.authServerUrl}/api/user/obtener-reportes-usuarios`);
  }
  actualizarReporteUsuario(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `${this.authServerUrl}/api/user/actualizar-estado-reporte`, body);
  }
  crearProducto(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.productServerUrl}/api/product/crear-producto`, body);
  }
  registrarPago(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.orderServiceUrl}/api/pagos/registrarPago`, body);
  }
  obtenerPagos(idOrden: any): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/pagos/obtenerEstadoPago/${idOrden}`);
  }


  obtenerDescuentoExclusivo(idUsuario: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/descuento/obtenerDescuentoExclusivo/${idUsuario}`);
  }
  generarDescuentoExclusivo(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.orderServiceUrl}/api/descuento/generarDescuentoExclusivo`, body);
  }
  obtenerTotalAcumulado(params: any): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/orders/obtenerMontoTotalAcumulado`, {}, params);

  }
}
