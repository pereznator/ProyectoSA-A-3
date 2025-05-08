import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { AdminService } from '../../admin/admin.service';
import { MainService } from '../../main/main.service';
import { ClientService } from '../client.service';
import { User } from '../../auth/auth.types';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, NgbModule, LoadingComponent, CurrencyPipe, DatePipe],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent implements OnInit {
  productos: any[] = [];
  loading: boolean = false;
  favoritos: any[] = [];
  user: User;
  constructor(
    private mainService: MainService,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private clientService: ClientService,
    private modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  
  ngOnInit(): void {
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

  getFavoritos(): void {
    this.clientService.obtenerFavoritos(this.user.id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.favoritos = resp.favoritos.map(item => {
        const producto = this.productos.find(p => p.product_id === item.product_id);
        return producto;
      });
      console.log(this.favoritos);
      this.loading = false;
    }, err => {
      this.favoritos = [];
      this.loading = false;
      console.log(err);
    });
  }

  getProductos(): void {
    this.loading = true;
    this.adminService.obtenerProductos().pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.productos = resp.productos;
      this.getFavoritos();
    }, err => {
      this.favoritos = [];
      this.loading = false;
      console.log(err);
    });
  }

  verProducto(idProducto: number): void {
    this.router.navigate(["productos", idProducto]);
  }

  eliminarFavorito(idProducto: number): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar favorito";
    modal.componentInstance.description = "¿Está seguro de eliminar este producto de favoritos?";
    modal.result.then((result) => {
      const body = {
        "user_id": this.user.id,
        "product_id": idProducto
      };
      this.clientService.eliminarFavorito(body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open("Producto eliminado de favoritos", "Cerrar", {
          duration: 10000,
          panelClass: ['snackbar-success']
        });
        this.getFavoritos();
      }, err => {
        console.log(err);
        this.snackBar.open("Error al eliminar el producto de favoritos", "Cerrar", {
          duration: 10000,
          panelClass: ['snackbar-error']
        });
      });
    }, dismiss => {});
  }

}
