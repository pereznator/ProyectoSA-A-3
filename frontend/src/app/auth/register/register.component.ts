import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { S3Service } from '../../s3.service';
import { v4 } from 'uuid';
import { ClientService } from '../../client/client.service';
import { User } from '../auth.types';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, RouterLink, NgFor],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
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
  showAlert: boolean = false;
  alertMessage: string = "";
  imagenPerfil: string | ArrayBuffer = null;
  archivo: File = null;

  passwordRegex = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}$/;

  registerForm: FormGroup = this.fb.group({
    nombre: [null, [Validators.required]],
    apellido: [null, [Validators.required]],
    telefono: [null, [Validators.required]],
    correo: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
    passwordRepeat: [null, [Validators.required]],
    img: [null, [Validators.required]],
    direccion: [null, [Validators.required]],
    departamento: [null, [Validators.required]],
    username: [null, [Validators.required]],
    fechaNacimiento: [null, [Validators.required]],
    sexo: [null, [Validators.required]],
    city: [null, [Validators.required]]
    // nombre: ["Jorge", [Validators.required]],
    // apellido: ["Perez", [Validators.required]],
    // telefono: ["12345678", [Validators.required]],
    // correo: ["jorgeperezlj@gmail.com", [Validators.required, Validators.email]],
    // password: ["Pa$$word123", [Validators.required, Validators.pattern(this.passwordRegex)]],
    // passwordRepeat: ["Pa$$word123", [Validators.required]],
    // img: [null, [Validators.required]],
    // direccion: ["direccion", [Validators.required]],
    // departamento: ["Guatemala", [Validators.required]],
    // username: ["jorigot", [Validators.required]],
    // fechaNacimiento: [null, [Validators.required]],
    // sexo: ["female", [Validators.required]],
    // city: ["city", [Validators.required]]
  });

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private s3Service: S3Service,
    private clienteService: ClientService
  ) {}

  get notValidNombre(): boolean {
    return this.registerForm.get("nombre").touched && this.registerForm.get("nombre").invalid;
  }
  get notValidApellido(): boolean {
    return this.registerForm.get("apellido").touched && this.registerForm.get("apellido").invalid;
  }
  get notValidTelefono(): boolean {
    return this.registerForm.get("telefono").touched && this.registerForm.get("telefono").invalid;
  }
  get notValidCorreo(): boolean {
    return this.registerForm.get("correo").touched && this.registerForm.get("correo").invalid;
  }
  get notValidDireccion(): boolean {
    return this.registerForm.get("direccion").touched && this.registerForm.get("direccion").invalid;
  }
  get notValidUsername(): boolean {
    return this.registerForm.get("username").touched && this.registerForm.get("username").invalid;
  }
  get notValidPassword(): boolean {
    return this.registerForm.get("password").touched && this.registerForm.get("password").invalid;
  }
  get notValidPasswordRepeat(): boolean {
    if (this.registerForm.get("passwordRepeat").touched && this.registerForm.get("passwordRepeat").invalid) {
      return true;
    }
    return this.registerForm.get("passwordRepeat").value !== this.registerForm.get("password").value;
  }
  get notValidDepartamento(): boolean {
    return this.registerForm.get("departamento").touched && this.registerForm.get("departamento").invalid;
  }
  get notValidFechaNacimiento(): boolean {
    return this.registerForm.get("fechaNacimiento").touched && this.registerForm.get("fechaNacimiento").invalid;
  }
  get notValidSexo(): boolean {
    return this.registerForm.get("sexo").touched && this.registerForm.get("sexo").invalid;
  }
  get notValidCity(): boolean {
    return this.registerForm.get("city").touched && this.registerForm.get("city").invalid;
  }

  register(): void {
    this.showAlert = false;
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.disable();
    const registerBody: User = {
      id: null,
      first_name: this.registerForm.get("nombre").value,
      last_name: this.registerForm.get("apellido").value,
      email: this.registerForm.get("correo").value,
      username: this.registerForm.get("username").value,
      password: this.registerForm.get("password").value,
      phone: this.registerForm.get("telefono").value,
      dob: this.registerForm.get("fechaNacimiento").value,
      gender: this.registerForm.get("sexo").value,
      role: "user",
      profile_picture: "",
      addresses: [
        {
          address: this.registerForm.get("direccion").value,
          city: this.registerForm.get("city").value,
          department: this.registerForm.get("departamento").value,
          is_primary: 1
        }
      ]
    };

    if (!this.archivo) {
      this.showAlert = true;
      this.alertMessage = "Seleccionar un archivo valido.";
      return;
    }

    const id = v4();
    this.s3Service.generateUploadUrl(this.archivo, id).pipe(take(1)).subscribe(url => {
      registerBody.profile_picture = url;
      this.authService.register(registerBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        const registerVerificationEmailBody = {
          user_id: resp.user_id,
          token: v4()
        };
        this.authService.registerVerificationEmail(registerVerificationEmailBody).pipe(take(1)).subscribe(respVerificatioEmail => {
          console.log("Email enviado", respVerificatioEmail);
          this.router.navigate(["auth", "login"]);
          return;
        });
      }, err => {
        console.log(err);
        this.showAlert = true;
        this.alertMessage = err.error.msg ?? "Algo salió mal.";
        this.registerForm.enable();
      });
      this.registerForm.enable();
    }, err => {
      console.log(err);
      this.showAlert = true;
      this.alertMessage = "Algo salió mal subiendo la imagen.";
      this.registerForm.enable();
    });
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
}
