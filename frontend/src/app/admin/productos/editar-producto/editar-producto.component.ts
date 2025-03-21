import { Component } from '@angular/core';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [ProductoFormComponent],
  template: '<app-producto-form [isNew]="false"></app-producto-form>',
})
export class EditarProductoComponent {

}
