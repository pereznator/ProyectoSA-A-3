import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { AuthService } from '../../auth/auth.service';
import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { User } from '../../auth/auth.types';
import { take } from 'rxjs';
import { Carrito } from './carrito.types';
import { FormsModule } from '@angular/forms';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgbModule, LoadingComponent, CurrencyPipe, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  
  loading: boolean = false;
  carrito: Carrito;
  user: User;

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  get total(): number {
    let total = 0;
    this.carrito.carrito.productos.map(pr => {
      total += (pr.cantidad * pr.precio_unidad);
    });
    return total;
  }

  ngOnInit(): void {
    this.loading = true;
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getCarrito();
    })
  }

  getCarrito(): void {
    this.loading = true;
    this.clientService.getCarrito(this.user.idCliente).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.carrito = resp.response_dinamodb;

      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    });
  }

  eliminarProducto(index: number): void {
    this.carrito.carrito.productos.splice(index, 1);
  }

  actualizar(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Actualizar Carrito";
    modal.componentInstance.description = "¿Estas seguro que deseas actualizar el carrito?";
    modal.result.then(result => {
      this.clientService.actualizarCarrito(this.carrito.id, this.carrito).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getCarrito();
      }, err => {
        console.log(err);
      });
    }, () => {});
  }

  crearOrden(): void {
    this.router.navigate(["cliente", "ordenes", "nuevo"]);
  }
}
