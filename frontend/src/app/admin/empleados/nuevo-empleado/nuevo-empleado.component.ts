import { Component } from '@angular/core';
import { EmpleadoFormComponent } from '../empleado-form/empleado-form.component';

@Component({
  selector: 'app-nuevo-empleado',
  standalone: true,
  imports: [EmpleadoFormComponent],
  template: '<app-empleado-form [isNew]="true"></app-empleado-form>',
})
export class NuevoEmpleadoComponent {

}
