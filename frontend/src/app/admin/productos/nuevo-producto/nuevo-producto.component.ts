import { Component } from '@angular/core';
import { ProductoFormComponent } from '../producto-form/producto-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [
    ProductoFormComponent,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: '<app-producto-form [isNew]="true"></app-producto-form>'
})
export class NuevoProductoComponent {

}
