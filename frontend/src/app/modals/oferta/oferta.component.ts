import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminService } from '../../admin/admin.service';
import { map, take } from 'rxjs';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [NgSelectModule, FormsModule, LoadingComponent, NgIf, NgFor],
  templateUrl: './oferta.component.html',
  styleUrl: './oferta.component.scss'
})
export class OfertaComponent implements OnInit {
  
  productoSeleccionado: number = null;
  loading = false;
  productos: any[] = [];
  valorOferta: number = 0;
  fecha: string;
  descripcion: string;

  constructor(
    public modal: NgbActiveModal,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getProductos();
  }

  getProductos(): void {
    this.loading = true;
    this.adminService.obtenerProductos().pipe(take(1), map(resp => resp.response_database.result)).subscribe(resp => {
      console.log(resp);
      this.productos = resp;
      this.loading = false;
    });
  }

  retornarValores(): void {
    if (!this.productoSeleccionado) {
      return;
    }
    if (this.valorOferta <= 0) {
      return;
    }
    if (!this.fecha) {
      return;
    }
    if (!this.descripcion) {
      return;
    }

    this.modal.close(
      {
        descripcion: this.descripcion,
        monto: this.valorOferta,
        fecha_vencimiento: new Date(this.fecha).toISOString().slice(0, 10),
        producto_id: this.productoSeleccionado,
        estado_oferta_id: 1,
      }
    );
  }
}
