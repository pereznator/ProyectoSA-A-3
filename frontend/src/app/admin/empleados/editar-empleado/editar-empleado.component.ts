import { Component } from '@angular/core';
import { EmpleadoFormComponent } from '../empleado-form/empleado-form.component';

@Component({
  selector: 'app-editar-empleado',
  standalone: true,
  imports: [EmpleadoFormComponent],
  template: '<app-empleado-form [isNew]="false"></app-empleado-form>',
})
export class EditarEmpleadoComponent {

}
