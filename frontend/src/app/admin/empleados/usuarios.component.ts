import { DatePipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { Router, RouterLink } from '@angular/router';
import { alarm } from 'ngx-bootstrap-icons';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../admin.service';
import { InputModalComponent } from '../../modals/input-modal/input-modal.component';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

const icons = { alarm };

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NgIf, NgFor, LoadingComponent, NgClass, DatePipe, UpperCasePipe, NgbModule, MatSnackBarModule],
  providers: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  
  usuarios: any[] = [];
  loading: boolean = false;
  
  constructor(
    private adminService: AdminService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(): void {
    this.loading = true;
    this.adminService.obtenerUsuarios().pipe(take(1),).subscribe(resp => {
      console.log(resp);
      this.usuarios = resp.usuarios;
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

  crearUsuario(): void {
    this.router.navigate(["admin", "usuarios", "nuevo"]);
  }
  editarUsuario(idUsuario: number): void {
    this.router.navigate(["admin", "usuarios", idUsuario]);
  }
  verReportados(): void {
    this.router.navigate(["admin", "usuarios", "reportados"]);
  }

  reportarUsuario(usuario: any): void {
    const modal = this.modalService.open(InputModalComponent);
    modal.componentInstance.title = "Reportar Usuario";
    modal.componentInstance.description = "Estas seguro que quieres reportar al usuario?";
    modal.componentInstance.placeholder = "Escribe el motivo del reporte";
    modal.result.then(result => {
      console.log(result);
      this.authService.currentUser$.pipe(take(1)).subscribe(me => {
        console.log(me);
        const body = {
          "reported_user_id": usuario.user_id,
          "reporter_user_id": me.id,
          "reason": result
        };
        this.adminService.reportarUsuario(body).pipe(take(1)).subscribe(codigoEmpleado => {
          console.log(codigoEmpleado);
          this.snackBar.open('Usuario Reportado', 'Cerrar', {
            duration: 3000, // en milisegundos
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }, err => {
          console.log(err);
        });
      });
    }, dismiss => {});
  }
}
