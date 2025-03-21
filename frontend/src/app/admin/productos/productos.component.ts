import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { AdminService } from '../admin.service';
import { take } from 'rxjs';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgbModule, LoadingComponent, CurrencyPipe],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  
  productos: any[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.loading = true;
    this.adminService.obtenerProductos().pipe(take(1)).subscribe(resp => {
      this.productos = resp.response_database.result;
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  eliminarProducto(idProducto: number): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Producto";
    modal.componentInstance.description = "Estas seguro que deseas eliminar este producto?";
    modal.result.then(result => {
      this.adminService.eliminarProducto(idProducto).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getProductos();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  nuevoProducto(): void {
    this.router.navigate(["admin", "productos", "nuevo"]);
  }

  editarProducto(idProducto: number): void {
    this.router.navigate(["admin", "productos", idProducto]);
  }

  verProveedores(): void {
    this.router.navigate(["admin", "proveedores"]);
  }

  verMercaderia(idProducto: number): void {
    this.router.navigate(["admin", "productos", idProducto, "mercaderia"]);
  }
  verOfertas(): void {
    this.router.navigate(["admin", "productos", "ofertas"])
  }
}
