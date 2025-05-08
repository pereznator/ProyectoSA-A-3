import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-input-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-modal.component.html'
})
export class InputModalComponent {

  @Input() title: string;
  @Input() description: string;
  input: string = "";
  @Input() placeholder: string = "";

  constructor(public modal: NgbActiveModal) {

  }

}
