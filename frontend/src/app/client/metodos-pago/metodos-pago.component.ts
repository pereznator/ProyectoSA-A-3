import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { User } from '../../auth/auth.types';
import { AuthService } from '../../auth/auth.service';
import { take } from 'rxjs';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';

@Component({
  selector: 'app-metodos-pago',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, LoadingComponent, NgbModule],
  templateUrl: './metodos-pago.component.html',
  styleUrl: './metodos-pago.component.scss'
})
export class MetodosPagoComponent implements OnInit {
  
  metodosPago: any[] = [];
  loading: boolean = false;
  usuario: User;

  constructor(
    private clienteService: ClientService,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.getMetodosPago();
  }

  getMetodosPago(): void {
    this.loading = true;
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.usuario = user;
      this.clienteService.getMetodosPago(this.usuario.idCliente).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.metodosPago = resp.response_database.result.map(met => {
          if (met.tipo_metodo_pago === "TARJETA") {
            met["detalles"] = `Termina en: ${met.numero_tarjeta.slice(11, 15)}, exp ${met.fecha_exp}`;
          } else if (met.tipo_metodo_pago === "TRANSFERENCIA") {
            met["detalles"] = "Subir el comprobante de la transferencia.";
          } else {
            met["detalles"] = "Pagar en efectivo al momento de la entrega.";
          }
          return met;
        });
        this.loading = false;
      }, err => {
        console.log(err);
      });
    })
  }

  nuevoMetodoPago(): void {
    this.router.navigate(["cliente", "metodos-pago", "nuevo"])
  }

  eliminarMetodoPago(idMetodoPago: number): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Método de Pago";
    modal.componentInstance.description = "Estas seguro que quieres eliminar este método de pago?";
    modal.result.then(result => {
      this.clienteService.eliminarMetodoPago(idMetodoPago).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getMetodosPago();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }
}
