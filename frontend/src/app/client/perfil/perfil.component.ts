import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { User } from '../../auth/auth.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../admin/admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgClass, NgFor, LoadingComponent, DatePipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  departamentos: string[] = [
    'Alta Verapaz',
    'Baja Verapaz',
    'Chimaltenango',
    'Chiquimula',
    'El Progreso',
    'Escuintla',
    'Guatemala',
    'Huehuetenango',
    'Izabal',
    'Jalapa',
    'Jutiapa',
    'Petén',
    'Quetzaltenango',
    'Quiché',
    'Retalhuleu',
    'Sacatepéquez',
    'San Marcos',
    'Santa Rosa',
    'Sololá',
    'Suchitepéquez',
    'Totonicapán',
    'Zacapa'
  ];
  imagenPerfil: string | ArrayBuffer = null;
  archivo: File = null;
  perfilForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = "";
  loading: boolean = false;

  usuario: User;
  passwordRegex = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}$/;
  estado_usuario_id: number;
  loadingPromociones: boolean = false;
  promocionesUsuario = [];
  loadingDescuento = true;
  descuentoExclusivo = null

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private adminService: AdminService,
    private modalService: NgbModal,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  get notValidNombre(): boolean {
    return this.perfilForm.get("nombre").touched && this.perfilForm.get("nombre").invalid;
  }
  get notValidApellido(): boolean {
    return this.perfilForm.get("apellido").touched && this.perfilForm.get("apellido").invalid;
  }
  get notValidTelefono(): boolean {
    return this.perfilForm.get("telefono").touched && this.perfilForm.get("telefono").invalid;
  }
  get notValidCorreo(): boolean {
    return this.perfilForm.get("correo").touched && this.perfilForm.get("correo").invalid;
  }
  get notValidDireccion(): boolean {
    return this.perfilForm.get("direccion").touched && this.perfilForm.get("direccion").invalid;
  }
  get notValidCity(): boolean {
    return this.perfilForm.get("city").touched && this.perfilForm.get("city").invalid;
  }
  get notValidDepartamento(): boolean {
    return this.perfilForm.get("departamento").touched && this.perfilForm.get("departamento").invalid;
  }
  get notValidUsername(): boolean {
    return this.perfilForm.get("username").touched && this.perfilForm.get("username").invalid;
  }

  getUser(): void {
    this.loading = true;
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      this.authService.getUser(`${user.id}`).pipe(take(1)).subscribe(userResponse => {
        console.log(userResponse);
        this.usuario = {
          id: userResponse.user_id,
          first_name: userResponse.first_name,
          last_name: userResponse.last_name,
          email: userResponse.email,
          username: userResponse.username,
          password: '',
          phone: userResponse.phone,
          dob: userResponse.dob,
          gender: userResponse.gender,
          role: userResponse.role,
          profile_picture: userResponse.profile_picture,
          addresses: userResponse.addresses.map(addr => ({
            address: addr.address,
            city: addr.city,
            department: addr.department,
            is_primary: addr.is_primary
          })),
          status: userResponse.status
        };
        this.obtenerPromocionesUsuario();
        this.obtenerDescuentoExclusivo();
        this.buildForm();
      }, err => {
        console.log(err);
      });
    });
  }

  obtenerPromocionesUsuario(): void {
    this.loadingPromociones = true;
    this.adminService.obtenerOfertasDeUsuario(this.usuario.id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.promocionesUsuario = resp.promociones ?? [];
      this.promocionesUsuario.forEach((promocion: any) => {
        promocion.fecha_inicio = new Date(promocion.fecha_inicio);
        promocion.fecha_fin = new Date(promocion.fecha_fin);
        promocion.expirado = new Date(promocion.fecha_fin) < new Date();
      });
      this.loadingPromociones = false;
    }, err => {
      console.log(err);
      this.loadingPromociones = false;
    });
  }

  buildForm(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.first_name, [Validators.required]],
      apellido: [this.usuario.last_name, [Validators.required]],
      correo: [this.usuario.email, [Validators.required, Validators.email]],
      username: [this.usuario.username, [Validators.required]],
      telefono: [this.usuario.phone, Validators.required],
      fechaNacimiento: [this.usuario.dob, Validators.required],
      sexo: [this.usuario.gender || 'male', Validators.required],
      role: [this.usuario.role || 'user', Validators.required],
      profile_picture: [null, []],
      direccion: [this.usuario.addresses[0].address, Validators.required],
      city: [this.usuario.addresses[0].city, Validators.required],
      departamento: [this.usuario.addresses[0].department, Validators.required]
    });
    this.perfilForm.get("nombre").disable();
    this.perfilForm.get("apellido").disable();
    this.perfilForm.get("username").disable();
    this.loading = false;
  }

  cargarImagen(event: any) {
    this.archivo = event.target.files[0];
    if (this.archivo) {
      const lector = new FileReader();
      lector.readAsDataURL(this.archivo);
      lector.onload = () => {
        this.imagenPerfil = lector.result;
      };
    }
  }

  guardar(): void {
    this.perfilForm.markAllAsTouched();
    if (this.perfilForm.invalid) {
      return;
    }
    this.perfilForm.disable();

    const actualizarPerfilBody = {
      "user_id": this.usuario.id,
      "email": this.perfilForm.get("correo").value,
      "phone": this.perfilForm.get("telefono").value,
      "addresses": [
        {
          "address": this.perfilForm.get("direccion").value,
          "city": this.perfilForm.get("city").value,
          "department": this.perfilForm.get("departamento").value,
          "is_primary": 1
        }
      ]
    };
    this.authService.actualizarPerfil(actualizarPerfilBody).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.perfilForm.enable();
      this.snackBar.open('Perfil Actualizado', 'Cerrar', {
        duration: 3000, // en milisegundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.getUser();
      return;
    }, err => {
      this.showAlert = true;
      this.perfilForm.enable();
      this.alertMessage = err.error.msj;
      return;
    });

  }

  canjearCupon(cupon: any): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = 'Canjear cupón';
    modal.componentInstance.description = `¿Está seguro que desea canjear el cupón "${cupon.name}"?`;
    modal.result.then(() => {
      this.loading = true;
      const body = {
        user_id: this.usuario.id,
        promotion_id: cupon.id
      };
      this.adminService.aplicarOferta(body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open('Cupón canjeado', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.obtenerPromocionesUsuario();
        this.loading = false;
      }, err => {
        console.log(err);
        this.loading = false;
      });
    }, dismiss => {});
  }

  obtenerDescuentoExclusivo(): void {
    this.adminService.obtenerDescuentoExclusivo(this.usuario.id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.descuentoExclusivo = {
        nivel: resp.descuento.nivel,
        porcentaje: resp.descuento.porcentaje,
        vence_en: resp.descuento.vence_en,
        activado_en: resp.descuento.activado_en,
        usado: resp.descuento.usado
      };
      this.loadingDescuento = false;
    }, err => {
      this.loadingDescuento = false;
      console.log(err);
    });
  }

  aplicarDescuento(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Aplicar Descuento Exclusivo";
    modal.componentInstance.description = `¿Está seguro que desea aplicar el descuento exclusivo?`;
    modal.result.then(() => {
      const body = {
        "user_id": this.usuario.id
      };
      this.clientService.aplicarDescuento(body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.snackBar.open('Descuento aplicado', 'Cerrar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.obtenerDescuentoExclusivo();
      }, err => {
        console.log(err);
      });
    }, err => {});
  }
}
