import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminService } from '../../admin/admin.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgFor, NgIf } from '@angular/common';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, take } from 'rxjs';

@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [NgSelectModule, LoadingComponent, NgIf, NgFor, FormsModule],
  templateUrl: './asignar-oferta.component.html'
})
export class AsignarOfertaComponent implements OnInit {
  
  loading = false;
  terminoBusqueda: string = '';
  promociones: any[] = [];
  promocionesFiltradas: any[] = [];
  promocionSeleccionada: any = null;
  mostrarDropdown: boolean = false;

  idPromocionSeleccionada: number;

  constructor(
    public modal: NgbActiveModal,
    private adminService: AdminService
  ) {}

  
  private busquedaChanged$: Subject<string> = new Subject<string>();
  
  ngOnInit(): void {
    this.cargarPromociones();
    this.busquedaChanged$.pipe(debounceTime(300)).subscribe((termino) => {
      this.aplicarFiltro(termino);
    });
  }
  
  cargarPromociones(): void {
    // Aquí iría tu llamada al backend
    this.adminService.obtenerOfertas().pipe(take(1)).subscribe({
      next: (resp) => {
        this.promociones = resp.promociones;
        this.promocionesFiltradas = [...this.promociones];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    })
  }
  
  onBusquedaChanged(): void {
    this.busquedaChanged$.next(this.terminoBusqueda);
  }
  
  aplicarFiltro(termino: string): void {
    const texto = termino.toLowerCase().trim();
    this.promocionesFiltradas = this.promociones.filter(promo =>
      promo.name.toLowerCase().includes(texto)
    );
  }
  
  seleccionarPromocion(promo: any): void {
    this.promocionSeleccionada = promo;
    this.terminoBusqueda = promo.nombre;
    this.idPromocionSeleccionada = promo.id;
    this.mostrarDropdown = false;
  }
  
  ocultarDropdown(): void {
    setTimeout(() => {
      this.mostrarDropdown = false;
    }, 200); // da tiempo para seleccionar
  }

  retornarValores(): void {
    if (!this.idPromocionSeleccionada) {
      return;
    }
    this.modal.close(this.idPromocionSeleccionada);
  }
}
