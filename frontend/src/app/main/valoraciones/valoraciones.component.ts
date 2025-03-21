import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../main.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/auth.types';
import { take } from 'rxjs';
import { EditValoracionComponent } from '../../modals/edit-valoracion/edit-valoracion.component';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';

@Component({
  selector: 'app-valoraciones',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, NgbModule, FormsModule, DatePipe],
  templateUrl: './valoraciones.component.html',
  styleUrl: './valoraciones.component.scss'
})
export class ValoracionesComponent implements OnInit {
  showComentarioInput = false;
  valoraciones: any[] = [];
  loading: boolean = false;
  nuevaValoracion = "";
  user: User;


  constructor(
    private mainService: MainService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getValoraciones();
  }

  getValoraciones(): void {
    this.loading = true;
    this.mainService.obtenerValoraciones().pipe(take(1)).subscribe(resp => {
      
      this.valoraciones = resp.response_database.filter(val => val.valoracion_pagina).map(val => {
        val.valoracion_pagina.id = val.id;
        return val.valoracion_pagina;
      });
      console.log(this.valoraciones);
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  publicarValoracion(): void {
    if (this.nuevaValoracion === "") {
      return;
    }
    const valoracionBody = {
      valoracion_pagina: {
        descripcion: this.nuevaValoracion,
        usuario: this.user.username,
        fecha: new Date().toISOString()
      }
    };

    this.mainService.crearValoracion(valoracionBody).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.showComentarioInput = false;
      this.nuevaValoracion = "";
      this.getValoraciones();
    }, err => {
      console.log(err);
    });
  }

  editValoracion(valoracion: any): void {
    const modal = this.modalService.open(EditValoracionComponent);
    modal.componentInstance.descripcion = valoracion.descripcion;
    modal.result.then(desc => {
      const valoracionBody = {
        valoracion_pagina: {
          descripcion: desc,
          usuario: valoracion.usuario,
          fecha: new Date()
        }
      };
      this.mainService.actualizarValoracion(valoracion.id, valoracionBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getValoraciones();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  eliminarValoracion(valoracion: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Valoración";
    modal.componentInstance.description = "Estas seguro que quieres eliminar tu valoración?";
    modal.result.then(result => {
      this.mainService.eliminarValoracion(valoracion.id).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getValoraciones();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }
}
