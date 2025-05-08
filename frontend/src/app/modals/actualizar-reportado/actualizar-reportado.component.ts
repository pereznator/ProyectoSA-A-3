import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-actualizar-reportado',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './actualizar-reportado.component.html'
})
export class ActualizarReportadoComponent {

  selected: string = null;
  options = ['pending', 'reviewed', 'resolved', 'dismissed']

  constructor(public modal: NgbActiveModal) {

  }

}
