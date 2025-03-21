import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ingreso-mercaderia',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingreso-mercaderia.component.html',
  styleUrl: './ingreso-mercaderia.component.scss'
})
export class IngresoMercaderiaComponent {

  unidades: number = 1;

  constructor(public modal: NgbActiveModal) {}
}
