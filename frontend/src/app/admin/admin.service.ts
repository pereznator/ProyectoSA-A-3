import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService, RequestMethod } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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

  crearProducto(producto: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/producto", producto);
  }

  obtenerProductos(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, "/producto");
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
    return this.httpService.request(RequestMethod.GET, `/pedido`, {}, params);
  }

  actualizarPedido(idPedido: number, body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `/pedido/${idPedido}`, body);
  }

  crearValidacionPago(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/validacion_pago", body);
  }
  crearOferta(oferta: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/oferta", oferta);
  }

  obtenerOfertas(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, "/oferta");
  }
  actualizarOferta(idOferta: number, body: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `/oferta/${idOferta}`, body);
  }
}
