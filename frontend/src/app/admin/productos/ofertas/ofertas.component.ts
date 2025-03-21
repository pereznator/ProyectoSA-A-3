import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { AdminService } from '../../admin.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OfertaComponent } from '../../../modals/oferta/oferta.component';
import { map, take } from 'rxjs';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';
import moment from 'moment';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, DatePipe, CurrencyPipe, NgbModule],
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss'
})
export class OfertasComponent implements OnInit{
  
  loading: boolean = false;
  ofertas: any[] = [];

  constructor(
    private adminService: AdminService,
    private location: Location,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.getOfertas();
  }

  getOfertas(): void {
    this.loading = true;
    this.adminService.obtenerOfertas().pipe(take(1), map(resp => resp.response_database.result)).subscribe(resp => {
      console.log(resp);
      this.ofertas = resp.map(oferta => {
        oferta["fecha"] = moment(oferta.fecha_vencimiento, "DD/MM/YYYY h:mm:ss A").format('MM/DD/YYYY');
        return oferta;
      });
      this.loading = false;
    }, err => {
      console.log(err);
    })
  }

  crearOferta(): void {
    const modal = this.modalService.open(OfertaComponent);
    modal.result.then(oferta => {
      this.adminService.crearOferta(oferta).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getOfertas();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }
  
  cancelarOferta(oferta: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Cancelar Oferta";
    modal.componentInstance.description = "¿Estas seguro que quieres cancelar la oferta?";
    modal.result.then(() => {
      this.adminService.actualizarOferta(oferta.id, {descripcion: null,monto: null,fecha_vencimiento: null,producto_id: null,estado_oferta_id: 2}).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.getOfertas();
      }, err => {
        console.log(err);
      });
    }, () => {});
  }

  atras(): void {
    this.location.back();
  }

}
