import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { DatePipe, Location, NgFor, NgIf } from '@angular/common';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { take } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CrearProveedorComponent } from '../../modals/crear-proveedor/crear-proveedor.component';
import moment from 'moment';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [NgIf, NgFor, LoadingComponent, DatePipe, NgbModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss'
})
export class ProveedoresComponent implements OnInit {
  
  proveedores: any[];
  loading: boolean = false;

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.getProveedores();
  }
  
  getProveedores(): void {
    this.loading = true;
    this.adminService.obtenerProveedores().pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.proveedores = resp.response_database.result.map(prov => {
        prov["fecha"] = moment(prov.fecha_registro, "DD/MM/YYYY h:mm:ss A").format('MM/DD/YYYY');
        return prov;
      });
      this.loading = false;
    }, err => {
      this.loading = false;
      console.log(err);
    });
  }

  crearProveedor(): void {
    const modal = this.modalService.open(CrearProveedorComponent);
    modal.result.then(nombre => {
      this.adminService.crearProveedor({nombre}).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getProveedores();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  eliminar(idProveedor: number): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar proveedor";
    modal.componentInstance.description = "Estas seguro que quieres eliminar al proveedor?";
    modal.result.then(result => {
      this.adminService.eliminarProveedor(idProveedor).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getProveedores();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  atras(): void {
    this.location.back();
  }
}
