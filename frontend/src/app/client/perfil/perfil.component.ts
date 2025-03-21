import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ClientService } from '../client.service';
import { Cliente } from '../client.types';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { S3Service } from '../../s3.service';
import { v4 } from "uuid";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, NgClass, RouterLink, LoadingComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  imagenPerfil: string | ArrayBuffer = null;
  archivo: File = null;
  perfilForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = "";
  loading: boolean = false;

  cliente: Cliente;
  passwordRegex = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}$/;
  estado_usuario_id: number;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private clientSerivce: ClientService,
    private s3Service: S3Service
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
  get notValidUsername(): boolean {
    return this.perfilForm.get("username").touched && this.perfilForm.get("username").invalid;
  }
  get notValidPassword(): boolean {
    return this.perfilForm.get("password").touched && this.perfilForm.get("password").invalid;
  }
  get notValidPasswordRepeat(): boolean {
    if (this.perfilForm.get("passwordRepeat").touched && this.perfilForm.get("passwordRepeat").invalid) {
      return true;
    }
    return this.perfilForm.get("passwordRepeat").value !== this.perfilForm.get("password").value;
  }

  getUser(): void {
    this.loading = true;
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.clientSerivce.getUser(`${user.idCliente}`).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.estado_usuario_id = resp.response_database.result[0].estado_usuario_id;
        this.cliente = {
          id: resp.response_database.result[0].id,
          nombre: resp.response_database.result[0].nombre,
          apellido: resp.response_database.result[0].apellido,
          email: resp.response_cognito.email,
          password: "",
          username: resp.response_cognito.Username,
          direccion: resp.response_database.result[0].direccion_entrega,
          fotografia: resp.response_database.result[0].fotografia,
          celular: resp.response_database.result[0].celular,
          estado: resp.response_database.result[0].estado_usuario,
        };
        this.buildForm();
      }, err => {
        console.log(err);
      });
    });
  }

  buildForm(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.cliente.nombre, [Validators.required]],
      apellido: [this.cliente.apellido, [Validators.required]],
      telefono: [this.cliente.celular, [Validators.required]],
      correo: [this.cliente.email, [Validators.required, Validators.email]],
      // password: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
      // passwordRepeat: [null, [Validators.required]],
      img: [null, []],
      direccion: [this.cliente.direccion, [Validators.required]],
      username: [{ value: this.cliente.username, disabled: true}, [Validators.required]]
    });
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

    const body = {
      nombre: this.perfilForm.get("nombre").value,
      apellido: this.perfilForm.get("apellido").value,
      celular: this.perfilForm.get("telefono").value,
      email: this.perfilForm.get("correo").value,
      direccion_entrega: this.perfilForm.get("direccion").value,
      username: this.perfilForm.get("username").value,
      estado_usuario_id: this.estado_usuario_id,
      fotografia: this.cliente.fotografia
    };

    if (this.archivo) {
      const id = v4();
      this.s3Service.uploadFileToBucket(this.archivo, "proyecto-2-ayd-2-g1", id).subscribe(bucketResp => {
        console.log(bucketResp);
        body.fotografia = bucketResp.Location;
        console.log(body);
        this.clientSerivce.update(this.cliente.id, body).pipe(take(1)).subscribe(resp => {
          console.log(resp);
          this.perfilForm.enable();
          this.imagenPerfil = null;
          this.archivo = null;
          this.getUser()
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    } else {
      this.clientSerivce.update(this.cliente.id, body).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.perfilForm.enable();
        this.imagenPerfil = null;
        this.archivo = null;
        this.getUser();
      }, err => {
        this.perfilForm.enable();
        console.log(err);
      });
    }

  }
}
