import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Empleado } from '../../../empleado/empleado.types';
import { EmpleadoService } from '../../../empleado/empleado.service';
import { ActivatedRoute } from '@angular/router';
import { Location, NgClass, NgIf } from '@angular/common';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { v4 } from 'uuid';
import { S3Service } from '../../../s3.service';
import { take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewCvComponent } from '../../../modals/view-cv/view-cv.component';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgClass, LoadingComponent],
  templateUrl: './empleado-form.component.html',
  styleUrl: './empleado-form.component.scss'
})
export class EmpleadoFormComponent implements OnInit {
  
  @Input() isNew: boolean;
  empleadoForm: FormGroup;
  loading: boolean = false;
  empleado: Empleado;
  imagenPerfil: string | ArrayBuffer = null;
  archivo: File = null;
  showAlert: boolean = false;
  alertMessage: string = "";
  cv: File;
  pdfLink: SafeResourceUrl;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private s3Service: S3Service,
    private dom: DomSanitizer,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.isNew) {
      this.buildForm();
    } else {
      this.getEmpleado();
    }
  }

  get notValidNombreCompleto(): boolean {
    return this.empleadoForm.get("nombreCompleto").touched && this.empleadoForm.get("nombreCompleto").invalid;
  }
  get notValidTelefono(): boolean {
    return this.empleadoForm.get("telefono").touched && this.empleadoForm.get("telefono").invalid;
  }
  get notValidDPI(): boolean {
    return this.empleadoForm.get("dpi").touched && this.empleadoForm.get("dpi").invalid;
  }
  get notValidCV(): boolean {
    return this.empleadoForm.get("cv").touched && this.empleadoForm.get("cv").invalid;
  }
  get notValidFotografia(): boolean {
    return this.empleadoForm.get("fotografia").touched && this.empleadoForm.get("fotografia").invalid;
  }
  get notValidDomicilio(): boolean {
    return this.empleadoForm.get("domicilio").touched && this.empleadoForm.get("domicilio").invalid;
  }
  get notValidEdad(): boolean {
    return this.empleadoForm.get("edad").touched && this.empleadoForm.get("edad").invalid;
  }
  get notValidGenero(): boolean {
    return this.empleadoForm.get("genero").touched && this.empleadoForm.get("genero").invalid;
  }
  get notValidSeguroSocial(): boolean {
    return this.empleadoForm.get("seguroSocial").touched && this.empleadoForm.get("seguroSocial").invalid;
  }
  get notValidCuentaBancaria(): boolean {
    return this.empleadoForm.get("cuentaBancaria").touched && this.empleadoForm.get("cuentaBancaria").invalid;
  }
  get notValidEstadoCivil(): boolean {
    return this.empleadoForm.get("estadoCivil").touched && this.empleadoForm.get("estadoCivil").invalid;
  }
  get notValidEmail(): boolean {
    return this.empleadoForm.get("email").touched && this.empleadoForm.get("email").invalid;
  }
  get notValidCodigoEmpleado(): boolean {
    return this.empleadoForm.get("codigoEmpleado").touched && this.empleadoForm.get("codigoEmpleado").invalid;
  }
  get notValidPassword(): boolean {
    return this.empleadoForm.get("password").touched && this.empleadoForm.get("password").invalid;
  }

  getEmpleado(): void {
    this.activatedRoute.params.pipe(take(1)).subscribe(params=> {
      this.empleadoService.obtenerPorId(params["idEmpleado"]).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.empleado = {
          id: resp.response_database.result[0].id,
          nombreCompleto: resp.response_database.result[0].nombre_completo,
          telefono: resp.response_database.result[0].telefono,
          dpi: resp.response_database.result[0].dpi,
          cv: resp.response_database.result[0].cv,
          fotografia: resp.response_database.result[0].fotografia,
          domicilio: resp.response_database.result[0].domicilio,
          edad: resp.response_database.result[0].edad,
          genero: resp.response_database.result[0].genero,
          seguroSocial: resp.response_database.result[0].seguro_social,
          cuentaBancaria: resp.response_database.result[0].cuenta_bancaria,
          estadoCivilId: resp.response_database.result[0].estado_civil_id,
          email: resp.response_cognito.email,
          codigoEmpleado: resp.response_cognito.Username,
          password: "",
          estado: resp.response_database.result[0].estado_usuario
        };
        this.pdfLink = this.dom.bypassSecurityTrustResourceUrl(this.empleado.cv);
        console.log(this.pdfLink);
        this.buildForm();
      });
    });
  }

  buildForm(): void {
    this.empleadoForm = this.fb.group({
      nombreCompleto: [this.empleado ? this.empleado.nombreCompleto : null, [Validators.required]],
      telefono: [this.empleado ? this.empleado.telefono : null, [Validators.required]],
      dpi: [this.empleado ? this.empleado.dpi : null, [Validators.required]],
      cv: [null, this.isNew ? [Validators.required] : []],
      fotografia: [null, this.isNew ? [Validators.required] : []],
      domicilio: [this.empleado ? this.empleado.domicilio : null, [Validators.required]],
      edad: [this.empleado ? this.empleado.edad : null, [Validators.required]],
      genero: [this.empleado ? this.empleado.genero : null, [Validators.required]],
      seguroSocial: [this.empleado ? this.empleado.seguroSocial : null, [Validators.required]],
      cuentaBancaria: [this.empleado ? this.empleado.cuentaBancaria : null, [Validators.required]],
      estadoCivil: [this.empleado ? this.empleado.estadoCivilId : null, [Validators.required]],
      email: [this.empleado ? this.empleado.email : null, [Validators.required]],
      codigoEmpleado: [this.empleado ? this.empleado.codigoEmpleado : null, [Validators.required]],
      password: [null, this.isNew ? [Validators.required] : []],
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

  onCVSelected(event): void {
    this.cv = event.target.files[0];
  }

  guardar(): void {
    this.showAlert = false;
    this.empleadoForm.markAllAsTouched();
    if (this.empleadoForm.invalid) {
      return;
    }
    this.empleadoForm.disable();
    const empleadoBody = {
      nombre_completo: this.empleadoForm.get("nombreCompleto").value,
      telefono: this.empleadoForm.get("telefono").value,
      dpi: this.empleadoForm.get("dpi").value,
      cv: "",
      fotografia: "",
      domicilio: this.empleadoForm.get("domicilio").value,
      edad: this.empleadoForm.get("edad").value,
      genero: this.empleadoForm.get("genero").value,
      seguro_social: this.empleadoForm.get("seguroSocial").value,
      cuenta_bancaria: this.empleadoForm.get("cuentaBancaria").value,
      estado_civil_id: this.empleadoForm.get("estadoCivil").value,
      email: this.empleadoForm.get("email").value,
      codigo_empleado: this.empleadoForm.get("codigoEmpleado").value,
      password: this.empleadoForm.get("password").value,
    };

    if (!this.isNew) {
      empleadoBody.cv = this.empleado.cv;
      empleadoBody.fotografia = this.empleado.fotografia;
      const bucketUrl = "https://proyecto-2-ayd-2-g1.s3.amazonaws.com";
      if (this.archivo) {
        const idFotografia = v4();
        this.s3Service.uploadFileToBucket(this.archivo, "proyecto-2-ayd-2-g1", idFotografia).pipe(take(1)).subscribe(respFoto => {
          console.log("UPDATE RESP FOTO", respFoto);
        }, err => {
          console.log("ERROR UPDATE FOTO", err);
        });
        empleadoBody.fotografia = `${bucketUrl}/${idFotografia}`;
      }
      if (this.cv) {
        const idCVNuevo = v4();
        this.s3Service.uploadFileToBucket(this.cv, "proyecto-2-ayd-2-g1", idCVNuevo).pipe(take(1)).subscribe(respCV => {
          console.log("UPDATE CV RESP", respCV);
        }, err => {
          console.log("ERROR UPDATE CV", err);
        });
        empleadoBody.cv = `${bucketUrl}/${idCVNuevo}`;
      }
      delete empleadoBody.password;
      
      this.empleadoService.actualizar(this.empleado.id, empleadoBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.empleadoForm.enable();
        this.getEmpleado();
        this.showAlert = false;
        return;
      }, err => {
        this.showAlert = true;
        this.empleadoForm.enable();
        this.alertMessage = err.error.msj;
        return;
      });
      return;
    }

    if (!this.archivo) {
      this.empleadoForm.enable();
      this.showAlert = true;
      this.alertMessage = "Ocurrio un problema cargando la fotografia del empleado.";
    }
    if (!this.cv) {
      this.empleadoForm.enable();
      this.showAlert = true;
      this.alertMessage = "Ocurrio un problema cargando el CV del Empleado.";
    }

    const idFotografia = v4();
    const idCV = v4();
    
    this.s3Service.uploadFileToBucket(this.archivo, "proyecto-2-ayd-2-g1", idFotografia).pipe(take(1)).subscribe(respFotografia => {
      console.log("RESP FOTOGRAFIA", respFotografia);
      empleadoBody.fotografia = respFotografia.Location;
      this.s3Service.uploadFileToBucket(this.cv, "proyecto-2-ayd-2-g1", idCV).pipe(take(1)).subscribe(respCV => {
        console.log("RESP CV", respCV);
        empleadoBody.cv = respCV.Location;
        this.empleadoService.crear(empleadoBody).pipe(take(1)).subscribe(resp => {
          this.empleadoForm.enable();
          console.log(resp);
        }, err => {
          console.log(err);
          this.empleadoForm.enable();
        });
      }, err => {
        console.log(err);
        this.empleadoForm.enable();
      });
    }, err => {
      console.log(err);
      this.empleadoForm.enable();
    });
  }


  verCV(): void {
    const modal = this.modalService.open(ViewCvComponent, { size: "xl" });
    modal.componentInstance.pdfLink = this.pdfLink;
    modal.result.then(result => {}, dismiss => {});
  }

  cambiarEstado(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = this.empleado.estado === "ACTIVO" ? "Desactivar Empleado" : "Activar Empleado";
    modal.componentInstance.description = this.empleado.estado === "ACTIVO" ? "Estas seguro que quieres desactivar a este empleado?" : "Estas seguro que quieres volver a activar a este empleado?";
    modal.result.then(result => {
      const estado = this.empleado.estado === "ACTIVO" ? 2 : 1;
      this.empleadoService.actualizar(this.empleado.id, { estado_usuario_id: estado }).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.loading = true;
        this.getEmpleado();
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  atras(): void {
    this.location.back();
  }
}
