import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-valoracion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-valoracion.component.html',
  styleUrl: './edit-valoracion.component.scss'
})
export class EditValoracionComponent {
  @Input() descripcion: string;
  constructor(public modal: NgbActiveModal) {}
}
