import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/auth.types';
import { take } from 'rxjs';
import { ViewCvComponent } from '../../modals/view-cv/view-cv.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LoadingComponent, NgbModule, DatePipe, CurrencyPipe],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.scss'
})
export class OrdenesComponent implements OnInit {
  
  pedidos: any[] = [];
  loading: boolean = false;
  user: User;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private modalService: NgbModal,
    private dom: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getPedidos();
  }

  getPedidos(): void {
    this.loading = true;
    this.clientService.obtenerPedidosDeCliente(this.user.idCliente).pipe(take(1)).subscribe(resp => {
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
      this.loading = false;
      console.log(err);
    });
  }

  verCV(pdfUrl: string): void {
    const safeUrl = this.dom.bypassSecurityTrustResourceUrl(pdfUrl);
    const modal = this.modalService.open(ViewCvComponent, { size: "xl" });
    modal.componentInstance.pdfLink = safeUrl;
    modal.result.then(result => {}, dismiss => {});
  }

  verOrden(orden: any): void {
    console.log(orden);
    this.router.navigate(["cliente", "ordenes", orden.id]);
  }
}
