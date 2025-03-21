import { Injectable } from "@angular/core";
import { HttpService, RequestMethod } from "../http.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class EmpleadoService {
  constructor(
    private httpService: HttpService
  ) {}

  crear(empleado: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/colaborador", empleado);
  }
  obtenerPorId(idEmpleado: string): Observable<any> {
    return this.httpService.request(RequestMethod.GET, `/colaborador/${idEmpleado}`);
  }
  actualizar(idEmpleado: number, empleado: any): Observable<any> {
    return this.httpService.request(RequestMethod.PUT, `/colaborador/${idEmpleado}`, empleado);
  }
  obtenerEmpleados(): Observable<any> {
    return this.httpService.request(RequestMethod.GET, "/colaborador");
  }
  enviarResetPassword(body: any): Observable<any> {
    return this.httpService.request(RequestMethod.POST, "/colaborador/send-recovery", body);
  }
}