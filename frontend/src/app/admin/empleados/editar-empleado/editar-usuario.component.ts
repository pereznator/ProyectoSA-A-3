import { Component } from '@angular/core';
import { UsuarioFormComponent } from '../empleado-form/usuario-form.component';

@Component({
  selector: 'app-editar-empleado',
  standalone: true,
  imports: [UsuarioFormComponent],
  template: '<app-usuario-form [isNew]="false"></app-usuario-form>',
})
export class EditarEmpleadoComponent {

}
