import { Injectable } from "@angular/core";
import { HttpService, RequestMethod } from "../http.service";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class ClientService {

  productServerUrl = environment.productServerUrl;
  orderServiceUrl = environment.orderServiceUrl;

  constructor(private httpService: HttpService) {}

  getUser(idCliente: string): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `/cliente/${idCliente}`);
  }

  update(idCliente: number, body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `/cliente/${idCliente}`, body);
  }

  crearDetalleTarjeta(detalles: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/detalle_tarjeta", detalles);
  }

  crearMetodoPago(metodoPago: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/metodo_pago", metodoPago);
  }

  getMetodosPago(idCliente: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, "/metodo_pago", null, { id_cliente: idCliente });
  }

  eliminarMetodoPago(idMetodoPago: number): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `/metodo_pago/${idMetodoPago}`);
  }

  getCarrito(idCliente: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/cart/obtenerCarritoUsuario/${idCliente}`);
  }

  limpiarCarrito(idCarrito: number): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `${this.orderServiceUrl}/api/cart/limpiarCarritoUsuario`, { user_id: idCarrito });
  }
  quitarItemCarrito(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `${this.orderServiceUrl}/api/cart/eliminarProductoCarrito`, body);
  }
  obtenerFavoritos(idCliente: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/favorite/obtenerFavoritosUsuario/${idCliente}`);
  }
  
  agregarFavorito(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.orderServiceUrl}/api/favorite/agregarFavorito`, body);
  }

  eliminarFavorito(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.DELETE, `${this.orderServiceUrl}/api/favorite/eliminarFavorito`, body);
  }

  crearPedido(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.orderServiceUrl}/api/orders/crearOrdenDesdeCarrito`, body);
  }

  crearDetallePedido(detallesPedido: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/detalle_pedido", detallesPedido);
  }

  crearPago(pago: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/pago", pago);
  }

  obtenerPedidosDeCliente(params: any): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/orders/obtenerHistorialOrdenes`, {}, params);
  }
  obtenerDetallePedido(idOrden:number, params: any): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/orders/obtenerDetalleOrden/${idOrden}`, {}, params);
  }

  obtenerPedidoPorId(idPedido): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `${this.orderServiceUrl}/api/orders/obtenerDetalleOrden/${idPedido}`);
  }

  crearReview(review: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, `${this.productServerUrl}/api/product/agregar-review-producto`, review);
  }
  aplicarDescuento(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `${this.orderServiceUrl}/api/descuento/aplicarDescuentoExclusivo`, body);
  }
}