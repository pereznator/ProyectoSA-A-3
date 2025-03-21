import { Component } from '@angular/core';
import { ProductoFormComponent } from '../producto-form/producto-form.component';

@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [ProductoFormComponent],
  template: '<app-producto-form [isNew]="true"></app-producto-form>'
})
export class NuevoProductoComponent {

}
