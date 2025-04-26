import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-carrito',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrar-pago.component.html'
})
export class RegistrarPagoComponent {
  metodoPago: string = null;
  cantidad: number = 1;

  constructor(
    public modal: NgbActiveModal
  ) {}

  cerrar(): void {
    if (!this.metodoPago) {
      return;
    }
    if (this.cantidad <= 0) {
      return;
    }
    this.modal.close({ metodoPago: this.metodoPago, cantidad: this.cantidad });
  }
}
