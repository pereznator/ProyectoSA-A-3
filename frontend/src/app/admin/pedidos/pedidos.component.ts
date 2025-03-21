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

  filtrarPor: number = 1;
  user: User;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private dom: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ){}
  
  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })
    this.getPedidos();
  }

  getPedidos(): void {
    this.loading = true;
    this.adminService.obtenerPedidos({ estado_pedido_id: this.filtrarPor }).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.pedidos = resp.response_database.map(pedido => {
        if (pedido.tipo_metodo_pago === "TARJETA") {
          pedido["detalle_tarjeta"] = `Termina en: ${pedido.numero_tarjeta.slice(11, 15)}, exp ${pedido.fecha_exp}`;
        } else if (pedido.tipo_metodo_pago === "TRANSFERENCIA") {
          pedido["detalle_tarjeta"] = "Subir el comprobante de la transferencia.";
        } else {
          pedido["detalle_tarjeta"] = "Pagar en efectivo al momento de la entrega.";
        }
        pedido["monto"] = 0;
        pedido.detalles.map(det => {
          pedido["monto"] += (det.precio * det.cantidad);
        });
        return pedido;
      });
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  verCV(pdfUrl: string): void {
    const safeUrl = this.dom.bypassSecurityTrustResourceUrl(pdfUrl);
    const modal = this.modalService.open(ViewCvComponent, { size: "xl" });
    modal.componentInstance.pdfLink = safeUrl;
    modal.result.then(result => {}, dismiss => {});
  }

  autorizar(pedido: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.description = "¿Estas seguro que quieres autorizar este pedido?";
    modal.componentInstance.title = "Autorizar Pedido";
    modal.result.then(() => {
      this.adminService.actualizarPedido(pedido.id, { estado_pedido_id: 2, cliente_id: null, oferta_id: null }).pipe(take(1)).subscribe(respPedido => {
        console.log("RESP PEDIDO", respPedido);
        const validacionPagoBody = {
          colaborador_id: this.user.idColaborador === 0 ? 7 : this.user.idColaborador,
          pago_id: pedido.pago_id
        };
        this.adminService.crearValidacionPago(validacionPagoBody).pipe(take(1)).subscribe(respValidacionPago => {
          console.log("RESP VALIDACION PAGO", respValidacionPago);
          this.getPedidos();
        }, err => {
          console.log("ERR VALIDACION PAGO", err);
        });
      }, err => {
        console.log("ERR PEDIDO", err);
      });
    }, () => {})
  }
  rechazar(pedido: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.description = "¿Estas seguro que quieres rechazar este pedido?";
    modal.componentInstance.title = "Rechazar Pedido";
    modal.result.then(() => {
      this.adminService.actualizarPedido(pedido.id, { estado_pedido_id: 3, cliente_id: null, oferta_id: null }).pipe(take(1)).subscribe(respPedido => {
        console.log("RESP PEDIDO", respPedido);
        this.getPedidos();
      }, err => {
        console.log("ERR PEDIDO", err);
      });
    }, () => {})
  }

  entregar(pedido: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.description = "¿Estas seguro que quieres entregar este pedido?";
    modal.componentInstance.title = "Entregar Pedido";
    modal.result.then(() => {
      this.adminService.actualizarPedido(pedido.id, { estado_pedido_id: 4, cliente_id: null, oferta_id: null }).pipe(take(1)).subscribe(respPedido => {
        console.log("RESP PEDIDO", respPedido);
        this.getPedidos();
      }, err => {
        console.log("ERR PEDIDO", err);
      });
    }, () => {})
  }

  verPedido(pedido: any): void {
    this.router.navigate(["admin", "pedidos", pedido.id])
  }
}
