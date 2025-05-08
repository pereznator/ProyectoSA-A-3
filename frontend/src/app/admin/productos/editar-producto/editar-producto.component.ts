import { Component } from '@angular/core';
import { ProductoFormComponent } from '../producto-form/producto-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-editar-producto',
  standalone: true,
  imports: [
    ProductoFormComponent,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: '<app-producto-form [isNew]="false"></app-producto-form>',
})
export class EditarProductoComponent {

}
