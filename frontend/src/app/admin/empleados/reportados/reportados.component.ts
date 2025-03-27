import { DatePipe, Location, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { alarm } from 'ngx-bootstrap-icons';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../admin.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { AuthService } from '../../../auth/auth.service';
import { ActualizarReportadoComponent } from '../../../modals/actualizar-reportado/actualizar-reportado.component';

const icons = { alarm };

@Component({
  selector: 'app-reportados',
  standalone: true,
  imports: [NgIf, NgFor, LoadingComponent, NgClass, DatePipe, UpperCasePipe, NgbModule, MatSnackBarModule, RouterLink],
  providers: [],
  templateUrl: './reportados.component.html'
})
export class UsuariosReportadosComponent implements OnInit {
  
  usuarios: any[] = [];
  loading: boolean = false;
  
  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.loading = true;
    this.adminService.obtenerReportados().pipe(take(1),).subscribe(resp => {
      console.log(resp);
      this.usuarios = resp.reportes;
      // this.empleados.map(emp => {
      //   emp["fecha"] = moment(emp.fecha_registro, "DD/MM/YYYY h:mm:ss A").format('MM/DD/YYYY');
      //   return emp;
      // });
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }
  verUsuario(idUsuario: number): void {
    this.router.navigate(["admin", "usuarios", idUsuario]);
  }

  actualizarReportado(reporte: any): void {
    const modal = this.modalService.open(ActualizarReportadoComponent);
    modal.result.then(resp => {
      if (resp) {
        const body = {
          "report_id": reporte.report_id,
          "estado": resp
        };
        this.adminService.actualizarReporteUsuario(body).pipe(take(1)).subscribe(resp => {
          this.getUsuarios();
          this.snackBar.open('Estado de Reporte Actualizado Exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        });
      }
    });
  }
}
