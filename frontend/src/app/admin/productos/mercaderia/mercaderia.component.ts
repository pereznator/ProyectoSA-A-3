import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../producto.types';
import { map, take } from 'rxjs';
import { IngresoMercaderiaComponent } from '../../../modals/ingreso-mercaderia/ingreso-mercaderia.component';

@Component({
  selector: 'app-mercaderia',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, DatePipe, CurrencyPipe, NgbModule],
  templateUrl: './mercaderia.component.html',
  styleUrl: './mercaderia.component.scss'
})
export class MercaderiaComponent implements OnInit {
  
  ingresos: any[] = [];
  loading: boolean = false;
  producto: Producto;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.getProducto();
  }

  getProducto(): void {
    this.loading = true;
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.adminService.obtenerProductoPorId(params["idProducto"]).pipe(take(1), map(resp => resp.response_database.result[0])).subscribe(resp => {
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
        };
        this.getMercaderias();    
      }, err => {
        console.log(err);
      });
    });
  }

  getMercaderias(): void {
    this.loading = true;
    this.adminService.getMercaderiaPorProductoId(this.producto.id).pipe(take(1), map(resp => resp.response_database.result)).subscribe(ingresos => {
      this.ingresos = ingresos;
      this.loading = false;
    }, err => {
      console.log("[ERROR AL OBTENER INGRESOS DE MERCADERIA]",err);
    });
  }

  nuevaMercaderia(): void {
    const modal = this.modalService.open(IngresoMercaderiaComponent);
    modal.result.then(unidades => {
      this.loading = true;

      const existenciaBody = {
        cantidad: unidades,
        producto_id: this.producto.id,
        monto: this.producto.costo * unidades
      };

      this.adminService.crearBulkExistencias(existenciaBody).pipe(take(1)).subscribe(resp => {
        console.log("RESP EXISTENCIA", resp);
        this.getMercaderias();
      }, err => {
        console.log("[ERROR BULK EXISTENCIA]", err);
      });
      // this.adminService.crearIngresoMercaderia().pipe(take(1), map(resp => resp.response_database.result.insertId)).subscribe(ingreso_mercaderia_id => {
      //   console.log(ingreso_mercaderia_id);
        // const egresoBody = {
        //   monto: this.producto.costo * unidades,
        //   ingreso_mercaderia_id
        // };
        // this.adminService.crearEgreso(egresoBody).pipe(take(1)).subscribe(() => {
        //   const existenciaBody = {
        //     cantidad: unidades,
        //     producto_id: this.producto.id,
        //     estado_existencia_id: 1,
        //     ingreso_mercaderia_id
        //   };
        //   this.adminService.crearBulkExistencias(existenciaBody).pipe(take(1)).subscribe(resp => {
        //     this.getMercaderias();
        //   }, err => {
        //     console.log("[ERROR BULK EXISTENCIA]", err);
        //   });
        // }, err => {
        //   console.log("[ERROR EGRESO]", err);
        // });
      // }, err => {
      //   console.log("[ERROR INGRESO MERCADERIA]", err);
      // });
    }, dismiss => {});
  }

  atras(): void {
    this.location.back();
  }
}
