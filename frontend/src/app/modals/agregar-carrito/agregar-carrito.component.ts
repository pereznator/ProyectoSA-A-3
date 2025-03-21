import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-carrito',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agregar-carrito.component.html',
  styleUrl: './agregar-carrito.component.scss'
})
export class AgregarCarritoComponent {

  unidades: number = 1;

  constructor(
    public modal: NgbActiveModal
  ) {}
}
