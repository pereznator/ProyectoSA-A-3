import { Injectable } from "@angular/core";
import { HttpService, RequestMethod } from "../http.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ClientService {
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
    return this.httpService.request(RequestMethod.GET, `/carrito/cliente/${idCliente}`);
  }

  actualizarCarrito(idCarrito: string, carrito: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `/carrito/${idCarrito}`, carrito);
  }

  crearPedido(pedido: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/pedido", pedido);
  }

  crearDetallePedido(detallesPedido: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/detalle_pedido", detallesPedido);
  }

  crearPago(pago: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/pago", pago);
  }

  obtenerPedidosDeCliente(idCliente: number): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `/pedido/cliente/${idCliente}`);
  }

  obtenerPedidoPorId(idPedido): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `/pedido/${idPedido}`);
  }
}