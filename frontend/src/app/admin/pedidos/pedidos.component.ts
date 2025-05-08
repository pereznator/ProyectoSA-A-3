import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { take } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewCvComponent } from '../../modals/view-cv/view-cv.component';
import { FormsModule } from '@angular/forms';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { User } from '../../auth/auth.types';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ActualizarEstadoOrdenComponent } from '../../modals/actualizar-estado-order/actualizar-estado-orden.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LoadingComponent, DatePipe, CurrencyPipe, FormsModule, NgbModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {

  loading: boolean = false;
  pedidos: any[] = []; 

  filtrarPor: string = '';
  user: User;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private dom: DomSanitizer,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}
  
  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      console.log(this.user);
      this.getPedidos();
    });
  }

  getPedidos(): void {
    this.loading = true;
    this.adminService.obtenerPedidos({ estado: this.filtrarPor }).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.pedidos = resp.ordenes ?? [];
      // this.pedidos = resp.response_database.map(pedido => {
      //   if (pedido.tipo_metodo_pago === "TARJETA") {
      //     pedido["detalle_tarjeta"] = `Termina en: ${pedido.numero_tarjeta.slice(11, 15)}, exp ${pedido.fecha_exp}`;
      //   } else if (pedido.tipo_metodo_pago === "TRANSFERENCIA") {
      //     pedido["detalle_tarjeta"] = "Subir el comprobante de la transferencia.";
      //   } else {
      //     pedido["detalle_tarjeta"] = "Pagar en efectivo al momento de la entrega.";
      //   }
      //   pedido["monto"] = 0;
      //   pedido.detalles.map(det => {
      //     pedido["monto"] += (det.precio * det.cantidad);
      //   });
      //   return pedido;
      // });
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  verOrden(orden: any): void {
    // this.router.navigate(["cliente", "ordenes", orden.order_id]);
    this.router.navigateByUrl("cliente/ordenes/" + orden.order_id);
  }

  actualizarEstado(orden: any): void {
    const modal = this.modalService.open(ActualizarEstadoOrdenComponent);
    modal.result.then(result => {
      const body = {
        "order_id": orden.order_id,
        "status": result.estadoNuevo,
        "location": result.location
      };
      this.adminService.actualizarPedido(body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open("Estado actualizado correctamente", "Cerrar", {
          duration: 10000,
          panelClass: "snackbar-success",
          verticalPosition: "bottom",
          horizontalPosition: "center"
        });
        this.getPedidos();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }
}
