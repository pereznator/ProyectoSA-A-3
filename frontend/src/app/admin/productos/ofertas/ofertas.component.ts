import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf, PercentPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { AdminService } from '../../admin.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OfertaComponent } from '../../../modals/oferta/oferta.component';
import { map, take } from 'rxjs';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, DatePipe, PercentPipe, NgbModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss'
})
export class OfertasComponent implements OnInit{
  
  loading: boolean = false;
  ofertas: any[] = [];

  constructor(
    private adminService: AdminService,
    private location: Location,
    private modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.getOfertas();
  }

  getOfertas(): void {
    this.loading = true;
    this.adminService.obtenerOfertas().pipe(take(1), map(resp => resp.promociones)).subscribe(resp => {
      console.log(resp);
      if (!resp) {
        this.ofertas = [];
        this.loading = false;
        return;
      }
      this.ofertas = resp;
      this.loading = false;
    }, err => {
      console.log(err);
    })
  }

  crearOferta(): void {
    const modal = this.modalService.open(OfertaComponent);
    modal.componentInstance.isNew = true;
    modal.result.then(oferta => {
      this.adminService.crearOferta(oferta).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open('Oferta Creada Exitosamente', 'Cerrar', {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.getOfertas();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  editarOferta(oferta: any): void {
    const modal = this.modalService.open(OfertaComponent);
    modal.componentInstance.isNew = false;
    modal.componentInstance.oferta = oferta;
    modal.result.then(oferta => {
      this.adminService.actualizarOferta(oferta).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open('Oferta Actualizada Exitosamente', 'Cerrar', {
          duration: 7000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.getOfertas();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  atras(): void {
    this.location.back();
  }

}
