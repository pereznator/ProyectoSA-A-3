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
import { AdminService } from '../../admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgbModule, LoadingComponent, CurrencyPipe, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent implements OnInit {
  
  loading: boolean = false;
  carrito: any[] = [];
  user: User;
  productos: any[] = [];

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  get total(): number {
    let total = 0;
    this.carrito.map(pr => {
      total += (pr.quantity * pr.producto.price);
    });
    return total;
  }

  ngOnInit(): void {
    this.loading = true;
    this.authService.currentUser$.subscribe(user => {
      console.log(user);
      this.user = user;
      // this.authService.getUser(`${user.user_id}`).pipe(take(1)).subscribe(userResponse => {
      //   this.user = {
      //     id: userResponse.user_id,
      //     first_name: userResponse.first_name,
      //     last_name: userResponse.last_name,
      //     email: userResponse.email,
      //     username: userResponse.username,
      //     password: '',
      //     phone: userResponse.phone,
      //     dob: userResponse.dob,
      //     gender: userResponse.gender,
      //     role: userResponse.role,
      //     profile_picture: userResponse.profile_picture,
      //     addresses: userResponse.addresses.map(addr => ({
      //       address: addr.address,
      //       city: addr.city,
      //       department: addr.department,
      //       is_primary: addr.is_primary
      //     })),
      //     status: userResponse.status
      //   };
      // }, err => {
      //   console.log(err);
      // });
      this.getProductos();
    });
  }

  getProductos(): void {
    this.adminService.obtenerProductos().pipe(take(1)).subscribe(respProductos => {
      console.log(respProductos);
      this.productos = respProductos.productos;
      this.getCarrito();
    });
  }

  getCarrito(): void {
    this.loading = true;
    this.clientService.getCarrito(this.user.id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.carrito = resp.carrito.map(item => {
        const producto = this.productos.find(p => p.product_id === item.product_id);
        const total = item.quantity * producto.price;
        return {
          producto,
          total,
          ...item
        };
      });
      this.loading = false;
    }, err => {
      this.loading = false;
      this.carrito = [];
      console.log(err);
    });
  }

  eliminarProducto(producto: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Producto";
    modal.componentInstance.description = "¿Estas seguro que deseas eliminar el producto del carrito?";
    modal.result.then(result => {
      const body = {
        "user_id": this.user.id,
        "product_id": producto.producto.product_id
      };
      this.clientService.quitarItemCarrito(body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open("Producto eliminado del carrito", "Cerrar", {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.getCarrito();
      }, err => {
        console.log(err);
      });
    }, () => {});
  }

  actualizar(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Limpiar Carrito";
    modal.componentInstance.description = "¿Estas seguro que deseas limpiar el carrito?";
    modal.result.then(result => {
      this.clientService.limpiarCarrito(this.user.id).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open("Carrito limpiado", "Cerrar", {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.getCarrito();
      }, err => {
        console.log(err);
      });
    }, () => {});
  }
  
  crearOrden(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Crear Orden";
    modal.componentInstance.description = "¿Estas seguro que deseas crear la orden?";
    modal.result.then(result => {
      this.clientService.crearPedido({ user_id: this.user.id }).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open("Orden creada", "Cerrar", {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.getCarrito();
      }, err => {
        console.log(err);
      });
    }, () => {});
  }
}
