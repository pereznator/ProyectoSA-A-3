import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../client/client.service';
import { MainService } from '../../main/main.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrarPagoComponent } from '../../modals/registrar-pago/registrar-pago.component';
import { AdminService } from '../../admin/admin.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LoadingComponent, CurrencyPipe, DatePipe, NgbModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PedidoComponent implements OnInit {
  
  loading: boolean = true;
  productos: any[] = [];
  pedido: any;
  total = 0;

  pago = {
    "monto": null,
    "estado": null,
    "metodo": null,
    "fecha_pago": null
  };

  tracking = {
    estado: null,
    ubicacion: null,
    ultima_actualizacion: null
  };
  loadingTracking: boolean = true;

  todosLosProductos: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private location: Location,
    private mainService: MainService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}
  
  ngOnInit(): void {
    this.getProductos();
  }
  
  getOrden(): void {
    this.loading = true;
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.clientService.obtenerPedidoPorId(params["id"]).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        let total = 0;
        this.productos = resp.productos.map(item => {
          const producto = this.todosLosProductos.find(prod => prod.id === item.producto_id);
          total += (item.cantidad * item.precio_unitario)
          return {
            ...item,
            producto: producto
          };
        });
        this.pedido = {
          order_id: Number(params["id"]),
        };
        this.total = total;
        this.rastrearPedido();
        this.obtenerEstadoPago();
      }, err => {
        console.log(err);
      });
    });  
  }

  getProductos(): void {
    this.mainService.obtenerProductos().pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.todosLosProductos = resp.productos;
      this.getOrden();
    }, err => {
      console.log(err);
    });
  }

  rastrearPedido(): void {
    this.adminService.obtenerSeguimientoPedido(this.pedido.order_id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.tracking = {
        estado: resp.tracking.estado,
        ubicacion: resp.tracking.ubicacion,
        ultima_actualizacion: resp.tracking.ultima_actualizacion
      };
      this.loadingTracking = false;
    }, err => {
      console.log(err);
      this.loadingTracking = false;
      this.snackBar.open("Error al rastrear el pedido", "Cerrar", {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }

  registrarPago(): void {
    const modal = this.modalService.open(RegistrarPagoComponent);
    modal.result.then(result => {
      const body = {
        "order_id": this.pedido.order_id,
        "method": result.metodoPago,
        "amount": result.cantidad
      };
      this.adminService.registrarPago(body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open("Pago registrado correctamente", "Cerrar", {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.obtenerEstadoPago();
      }, err => {
        console.log(err);
        this.snackBar.open("Error al registrar el pago", "Cerrar", {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      });
    }, dismiss => {});
  }

  obtenerEstadoPago(): void {
    this.adminService.obtenerPagos(this.pedido.order_id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.pago = resp.pago;
      this.loading = false;
    }, err => {
      console.log(err);
      this.snackBar.open("Error al obtener el estado del pago", "Cerrar", {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }

  atras(): void {
    this.location.back();
  }
}
