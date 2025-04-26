import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empleado } from '../../../empleado/empleado.types';
import { EmpleadoService } from '../../../empleado/empleado.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { v4 } from 'uuid';
import { S3Service } from '../../../s3.service';
import { map, take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal, NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ViewCvComponent } from '../../../modals/view-cv/view-cv.component';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';
import { AdminService } from '../../admin.service';
import { User } from '../../../auth/auth.types';
import { AuthService } from '../../../auth/auth.service';
import { AsignarOfertaComponent } from '../../../modals/asignar-oferta/asignar-oferta.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { truckFlatbed } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgClass, LoadingComponent, UpperCasePipe, NgFor, DatePipe],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss'
})
export class UsuarioFormComponent implements OnInit {
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
  @Input() isNew: boolean;
  usuarioForm: FormGroup;
  loading: boolean = false;
  usuario: User;
  imagenPerfil: string | ArrayBuffer = null;
  archivo: File = null;
  showAlert: boolean = false;
  showSuccess: boolean = false;
  alertMessage: string = "";
  cv: File;
  pdfLink: SafeResourceUrl;
  promocionesUsuario: any[] = [];
  loadingPromociones: boolean = false;

  loadingDescuento = true;
  descuentoExclusivo: any = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private s3Service: S3Service,
    private dom: DomSanitizer,
    private modalService: NgbModal,
    private authService: AuthService,
    private snackService: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.isNew) {
      this.buildForm();
    } else {
      this.getUsuario();
    }
  }

  get notValidNombre(): boolean {
    return this.usuarioForm.get("nombre").touched && this.usuarioForm.get("nombre").invalid;
  }
  get notValidApellido(): boolean {
    return this.usuarioForm.get("apellido").touched && this.usuarioForm.get("apellido").invalid;
  }
  get notValidTelefono(): boolean {
    return this.usuarioForm.get("telefono").touched && this.usuarioForm.get("telefono").invalid;
  }
  get notValidCorreo(): boolean {
    return this.usuarioForm.get("correo").touched && this.usuarioForm.get("correo").invalid;
  }
  get notValidDireccion(): boolean {
    return this.usuarioForm.get("direccion").touched && this.usuarioForm.get("direccion").invalid;
  }
  get notValidUsername(): boolean {
    return this.usuarioForm.get("username").touched && this.usuarioForm.get("username").invalid;
  }
  get notValidPassword(): boolean {
    return this.usuarioForm.get("password").touched && this.usuarioForm.get("password").invalid;
  }
  get notValidDepartamento(): boolean {
    return this.usuarioForm.get("departamento").touched && this.usuarioForm.get("departamento").invalid;
  }
  get notValidFechaNacimiento(): boolean {
    return this.usuarioForm.get("fechaNacimiento").touched && this.usuarioForm.get("fechaNacimiento").invalid;
  }
  get notValidSexo(): boolean {
    return this.usuarioForm.get("sexo").touched && this.usuarioForm.get("sexo").invalid;
  }
  get notValidCity(): boolean {
    return this.usuarioForm.get("city").touched && this.usuarioForm.get("city").invalid;
  }
  get notValidRole(): boolean {
    return this.usuarioForm.get("role").touched && this.usuarioForm.get("role").invalid;
  }

  getUsuario(): void {
    this.activatedRoute.params.pipe(take(1)).subscribe(params=> {
      this.adminService.obtenerUsuarioPorId(params["idUsuario"]).pipe(take(1), map(resp => resp.usuario)).subscribe(userResponse => {
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

  buildForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: [this.usuario?.first_name || null, [Validators.required]],
      apellido: [this.usuario?.last_name || null, [Validators.required]],
      correo: [this.usuario?.email || null, [Validators.required, Validators.email]],
      username: [this.usuario?.username || null, [Validators.required]],
      password: ['', this.isNew ? Validators.required : []],
      telefono: [this.usuario?.phone || null, Validators.required],
      fechaNacimiento: [this.usuario?.dob || null, Validators.required],
      sexo: [this.usuario?.gender || 'male', Validators.required],
      role: [this.usuario?.role || 'user', Validators.required],
      profile_picture: [null, []],
      direccion: [this.usuario?.addresses?.[0]?.address || null, Validators.required],
      city: [this.usuario?.addresses?.[0]?.city || null, Validators.required],
      departamento: [this.usuario?.addresses?.[0]?.department || null, Validators.required]
    });
    if (!this.isNew) {
      this.usuarioForm.get("nombre").disable();
      this.usuarioForm.get("apellido").disable();
      this.usuarioForm.get("username").disable();
      this.usuarioForm.get("fechaNacimiento").disable();
      this.usuarioForm.get("sexo").disable();
      this.usuarioForm.get("role").disable();
      this.usuarioForm.get("profile_picture").disable();
    }
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

  onCVSelected(event): void {
    this.cv = event.target.files[0];
  }

  guardar(): void {
    this.showAlert = false;
    this.usuarioForm.markAllAsTouched();
    if (this.usuarioForm.invalid) {
      return;
    }
    this.usuarioForm.disable();
    const registerBody: User = {
      id: null,
      first_name: this.usuarioForm.get("nombre").value,
      last_name: this.usuarioForm.get("apellido").value,
      email: this.usuarioForm.get("correo").value,
      username: this.usuarioForm.get("username").value,
      password: this.usuarioForm.get("password").value,
      phone: this.usuarioForm.get("telefono").value,
      dob: this.usuarioForm.get("fechaNacimiento").value,
      gender: this.usuarioForm.get("sexo").value,
      role: this.usuarioForm.get("role").value,
      profile_picture: "",
      addresses: [
        {
          address: this.usuarioForm.get("direccion").value,
          city: this.usuarioForm.get("city").value,
          department: this.usuarioForm.get("departamento").value,
          is_primary: 1
        }
      ]
    };

    if (!this.isNew) {
      const actualizarPerfilBody = {
        "user_id": this.usuario.id,
        "email": registerBody.email,
        "phone": registerBody.phone,
        "addresses": [
          {
            "address": registerBody.addresses[0].address,
            "city": registerBody.addresses[0].city,
            "department": registerBody.addresses[0].department,
            "is_primary": 1
          }
        ]
      };
      this.authService.actualizarPerfil(actualizarPerfilBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.usuarioForm.enable();
        this.getUsuario();
        this.showAlert = false;
        this.showSuccess = true;
        this.alertMessage = "Usuario actualizado exitosamente.";
        return;
      }, err => {
        this.showAlert = true;
        this.usuarioForm.enable();
        this.alertMessage = err.error.msj;
        return;
      });
    } else {
      if (!this.archivo) {
        this.usuarioForm.enable();
        this.showAlert = true;
        this.alertMessage = "Ocurrio un problema cargando la fotografia del usuario.";
      }
  
      const idFotografia = v4();
      
      this.s3Service.generateUploadUrl(this.archivo,  idFotografia).pipe(take(1)).subscribe(respFotografia => {
        console.log("RESP FOTOGRAFIA", respFotografia);
        registerBody.profile_picture = respFotografia;
        this.authService.register(registerBody).pipe(take(1)).subscribe(resp => {
          const registerVerificationEmailBody = {
            user_id: resp.user_id,
            token: v4()
          };
          this.authService.registerVerificationEmail(registerVerificationEmailBody).pipe(take(1)).subscribe(respVerificatioEmail => {
            console.log("Email enviado", respVerificatioEmail);
            this.usuarioForm.enable();
            this.usuarioForm.reset();
            this.imagenPerfil = null;
            this.archivo = null;
            this.showSuccess = true;
            this.alertMessage = "Usuario creado exitosamente.";
            console.log(resp);
          });
        }, err => {
          console.log(err);
          this.usuarioForm.enable();
        });
      }, err => {
        console.log(err);
        this.usuarioForm.enable();
      });
    }
  }

  cambiarEstado(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = this.usuario.status === "active" ? "Desactivar Usuario" : "Activar Usuario";
    modal.componentInstance.description = this.usuario.status === "active" ? "Estas seguro que quieres desactivar a este usuario?" : "Estas seguro que quieres volver a activar a este empleado?";
    modal.result.then(result => {
      const body = { user_id: this.usuario.id };
      const endpoint = this.usuario.status === "active" ? this.authService.desactivarUsuario(body) : this.authService.activarUsuario(body);
      endpoint.pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.loading = true;
        this.getUsuario();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  obtenerPromocionesUsuario(): void {
    this.loadingPromociones = true;
    this.adminService.obtenerOfertasDeUsuario(this.usuario.id).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.promocionesUsuario = resp.promociones ?? [];
      this.loadingPromociones = false;
    }, err => {
      console.log(err);
      this.loadingPromociones = false;
    });
  }

  asignarPromocion(): void {
    const modal = this.modalService.open(AsignarOfertaComponent);

    modal.result.then(result => {
      console.log(result);
      const body = {
        user_id: this.usuario.id,
        promotion_id: result
      };
      this.adminService.asignarOferta(body).pipe(take(1)).subscribe({
        next: (resp) => {
          console.log(resp);
          this.snackService.open('Oferta Asignada Exitosamente', 'Cerrar', {
            duration: 7000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.obtenerPromocionesUsuario();
        },
        error: (err) => {
          console.log(err);
        }
      })
    }, dismiss => {});
  }

  atras(): void {
    this.location.back();
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

  generarDescuentoExclusivo(): void {
    this.adminService.obtenerTotalAcumulado({ user_id: this.usuario.id, rango: "30d" }).pipe(take(1)).subscribe(total => {
      const modal = this.modalService.open(ConfirmActionComponent);
      modal.componentInstance.title = "Generar Descuento Exclusivo";
      modal.componentInstance.description = "Estas seguro que quieres generar un descuento exclusivo para este usuario? (total acumulado: Q" + total.total_gastado + ".00)";
      modal.result.then(result => {
        const body = {
          user_id: this.usuario.id,
          total_acumulado: total.total_gastado
        };
        this.adminService.generarDescuentoExclusivo(body).pipe(take(1)).subscribe(resp => {
          console.log(resp);
          this.snackService.open('Descuento Exclusivo Generado Exitosamente', 'Cerrar', {
            duration: 7000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.obtenerDescuentoExclusivo();
        }, err => {
          console.log(err);
        });
      }, dismiss => {});
    }, errTotal => {
      console.log(errTotal);
    });
  }
}
