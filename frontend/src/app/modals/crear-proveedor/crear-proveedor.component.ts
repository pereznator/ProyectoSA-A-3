import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear-proveedor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear-proveedor.component.html',
  styleUrl: './crear-proveedor.component.scss'
})
export class CrearProveedorComponent {

  nombre: string = "";

  constructor(public modal: NgbActiveModal) {}
}
