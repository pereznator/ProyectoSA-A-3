import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { Producto } from '../../admin/productos/producto.types';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/auth.types';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { AgregarCarritoComponent } from '../../modals/agregar-carrito/agregar-carrito.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgbModule, LoadingComponent, CurrencyPipe, FormsModule, DatePipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {
  
  loading: boolean = false;
  producto: Producto;
  comentarios: any[] = [];
  showComentarioInput: boolean = false;
  nuevoComentario: string = "";
  nuevaPuntuacion: number = null;
  user: User;

  constructor(
    private mainService: MainService,
    public location: Location,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private snackService: MatSnackBar,
    private clientService: ClientService
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      console.log(user);
      const id = user.id ?? user.user_id;
      this.authService.getUser(`${id}`).pipe(take(1)).subscribe(userResponse => {
        this.user = {
          id: userResponse.user_id,
          first_name: userResponse.first_name,
          last_name: userResponse.last_name,
          email: userResponse.email,
          username: userResponse.username,
          password: '',
          phone: userResponse.phone,
          dob: userResponse.dob,
          gender: userResponse.gender,
          role: userResponse.role,
          profile_picture: userResponse.profile_picture,
          addresses: userResponse.addresses.map(addr => ({
            address: addr.address,
            city: addr.city,
            department: addr.department,
            is_primary: addr.is_primary
          })),
          status: userResponse.status
        };
      }, err => {
        console.log(err);
      });
    });
    this.getProducto();
  }

  getProducto(): void {
    this.loading = true;
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.mainService.obtenerProducto(params["idProducto"]).pipe(take(1), map(resp => resp.producto)).subscribe(resp => {
        console.log(resp);
        this.producto = {
          id: resp.product_id,
          name: resp.name,
          description: resp.description,
          price: resp.price,
          stock_quantity: resp.stock_quantity,
          code: resp.code,
          main_image_url: resp.main_image_url,
          value: resp.value,
          category_name: resp.category,
          marcas: resp.brands,
          regiones: resp.restricted_regions,
          imagenes: resp.images,
          brands: resp.brands,
          status: resp.status,
        };
        this.loading = false;
        // this.getComentarios();
      }, err => {
        console.log(err);
      });
    });
  }

  

  agregarAlCarrito(): void {
    console.log(this.user);
    if (!this.user) {
      this.router.navigate(["auth", "login"]);
      return;
    }
    if (this.user.role !== "user") {
      return;
    }
    const modal = this.modalService.open(AgregarCarritoComponent);
    modal.result.then(unidades => {
      const carritoBody = {
        "user_id": this.user.id,
        "product_id": this.producto.id,
        "quantity" : unidades
      };
      if (unidades <= 0) {
        this.snackService.open("No se puede agregar 0 unidades al carrito", "Cerrar", {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        return;
      }

      if (unidades > this.producto.stock_quantity) {
        this.snackService.open("No hay suficiente stock", "Cerrar", {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        return;
      }

      this.mainService.agregarAlCarrito(carritoBody).pipe(take(1)).subscribe(resp => {
        console.log("AGREGADO AL CARRITO", resp);
        this.router.navigate(["cliente", "carrito"]);
      }, err => {
        console.log(err);
      });
    }, () => {})
  }

  publicarComentario(): void {
    const comentarioBody = {
      valoracion: this.nuevaPuntuacion,
      comentario: this.nuevoComentario,
      cliente_id: this.user.id,
      producto_id: this.producto.id
    };

    this.mainService.crearComentarioDeProducto(comentarioBody).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.loading = true;
      this.nuevaPuntuacion = null;
      this.nuevoComentario = "";
      this.showComentarioInput = false;
      // this.getComentarios();
    })
  }

  eliminarComentario(idComentario: number): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Comentario";
    modal.componentInstance.description = "¿Estas seguro que quieres eliminar tu comentario?";
    modal.result.then(result => {
      this.mainService.eliminarComentario(idComentario).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.loading = true;
        // this.getComentarios();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }
  

  agregarAFavoritos(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Agregar a Favoritos";
    modal.componentInstance.description = "¿Estas seguro que quieres agregar el producto a favoritos?";
    modal.result.then(result => {
      const favoritosBody = {
        "user_id": this.user.id,
        "product_id": this.producto.id
      };
      this.clientService.agregarFavorito(favoritosBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackService.open("Producto agregado a favoritos", "Cerrar", {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }, err => {
        console.log(err);
      });
    }
    , dismiss => {});
  }
}
