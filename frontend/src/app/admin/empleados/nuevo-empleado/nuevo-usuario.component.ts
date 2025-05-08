import { Component } from '@angular/core';
import { UsuarioFormComponent } from '../empleado-form/usuario-form.component';

@Component({
  selector: 'app-nuevo-empleado',
  standalone: true,
  imports: [UsuarioFormComponent],
  template: '<app-usuario-form [isNew]="true"></app-usuario-form>',
})
export class NuevoEmpleadoComponent {

}
