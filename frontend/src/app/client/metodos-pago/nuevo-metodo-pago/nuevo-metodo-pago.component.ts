import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../client.service';
import { take } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/auth.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-metodo-pago',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, LoadingComponent, ReactiveFormsModule],
  templateUrl: './nuevo-metodo-pago.component.html',
  styleUrl: './nuevo-metodo-pago.component.scss'
})
export class NuevoMetodoPagoComponent implements OnInit {
  
  tarjetaForm: FormGroup;
  metodoPagoSeleccionado = "tarjeta";
  loading: boolean = true;
  user: User;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private clienteService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  get notValidNumeroTarjeta(): boolean {
    return this.tarjetaForm.get("numero").touched && this.tarjetaForm.get("numero").invalid;
  }
  get notValidCVVTarjeta(): boolean {
    return this.tarjetaForm.get("cvv").touched && this.tarjetaForm.get("cvv").invalid;
  }
  get notValidMesExpTarjeta(): boolean {
    return this.tarjetaForm.get("mesExp").touched && this.tarjetaForm.get("mesExp").invalid;
  }
  get notValidYearExpTarjeta(): boolean {
    return this.tarjetaForm.get("yearExp").touched && this.tarjetaForm.get("yearExp").invalid;
  }
  
  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.crearFormulario();
    })
  }

  crearFormulario(): void {
    this.tarjetaForm = this.fb.group({
      nombre: [null, []],
      numero: [null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cvv: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      mesExp: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      yearExp: [null, [Validators.required, Validators.min(2024)]]
    });
    this.loading = false;
  }

  guardar(): void {
    if (this.metodoPagoSeleccionado === "tarjeta") {
      this.tarjetaForm.markAllAsTouched();
      if (this.tarjetaForm.invalid) {
        return;
      }
      this.tarjetaForm.disable();
      const fechaExp = new Date(this.tarjetaForm.get("yearExp").value, this.tarjetaForm.get("mesExp").value - 1);
      
      const detalleTarjeta = {
        numero_tarjeta: this.tarjetaForm.get("numero").value,
        cvv: this.tarjetaForm.get("cvv").value,
        fecha_exp: fechaExp.toISOString().slice(0, 10),
      };

      this.clienteService.crearDetalleTarjeta(detalleTarjeta).pipe(take(1)).subscribe(respDetalle => {
        console.log("DETALLE", respDetalle);
        const detalleId = respDetalle.response_database.result.insertId;
        const metodoPagoBody = {
          tipo_metodo_pago_id: 1,
          cliente_id: this.user.idCliente,
          detalle_tarjeta_id: detalleId
        };
        this.clienteService.crearMetodoPago(metodoPagoBody).pipe(take(1)).subscribe(respMetodoPago => {
          console.log(respMetodoPago);
          this.router.navigate(["cliente", "metodos-pago"]);
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    } else {
      const metodoPagoBody = {
        tipo_metodo_pago_id: this.metodoPagoSeleccionado === "efectivo" ? 2 : 3,
        cliente_id: this.user.idCliente,
        detalle_tarjeta_id: null
      };
      this.clienteService.crearMetodoPago(metodoPagoBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.router.navigate(["cliente", "metodos-pago"]);
      }, err => {
        console.log(err);
      });
    }
  }

  atras(): void {
    this.location.back();
  }
}
