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
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getProducto();
  }

  getProducto(): void {
    this.loading = true;
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.mainService.obtenerProductoPorId(params["idProducto"]).pipe(take(1), map(resp => resp['response_database'].result[0])).subscribe(resp => {
        console.log(resp);
        this.producto = {
          id: resp.id,
          portada: resp.portada,
          nombre: resp.nombre,
          categoriaId: resp.categoria_producto_id,
          precio: resp.precio,
          costo: resp.costo,
          fecha: resp.fecha_registro,
          descripcion: resp.descripcion,
          proveedorId: resp.proveedor_id,
          categoria: resp.categoria_producto,
          proveedor: resp.proveedor,
          enExistencia: resp.en_existencia
        };
        this.getComentarios();
      }, err => {
        console.log(err);
      });
    });
  }

  getComentarios(): void {
    this.mainService.obtenerComentariosDeProducto(`${this.producto.id}`).pipe(take(1), map(resp => resp["response_database"].result)).subscribe(resp => {
      this.comentarios = resp;
      console.log(this.comentarios);
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  agregarAlCarrito(): void {
    if (!this.user) {
      this.router.navigate(["auth", "login"]);
      return;
    }
    if (this.user.tipoUsuario !== "CLIENTE") {
      return;
    }
    const modal = this.modalService.open(AgregarCarritoComponent);
    modal.result.then(unidades => {
      const carritoBody = {
        carrito: {
          cliente_id: this.user.idCliente,
          productos: [
            {
              producto_id: this.producto.id,
              cantidad: unidades,
              precio_unidad: this.producto.precio,
              nombre_producto: this.producto.nombre
            }
          ]
        }
      };
      this.mainService.agregarAlCarrito(this.user.idCliente, carritoBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
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
      cliente_id: this.user.idCliente,
      producto_id: this.producto.id
    };

    this.mainService.crearComentarioDeProducto(comentarioBody).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.loading = true;
      this.nuevaPuntuacion = null;
      this.nuevoComentario = "";
      this.showComentarioInput = false;
      this.getComentarios();
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
        this.getComentarios();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }
}
