import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-carrito',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './actualizar-estado-orden.component.html'
})
export class ActualizarEstadoOrdenComponent {
  estadoNuevo: string = null;
  location: string = null;

  constructor(
    public modal: NgbActiveModal
  ) {}

  cerrar(): void {
    if (!this.estadoNuevo) {
      return;
    }
    if (!this.location) {
      return;
    }
    this.modal.close({ estadoNuevo: this.estadoNuevo, location: this.location });
  }
}
