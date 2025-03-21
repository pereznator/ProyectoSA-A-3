import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgClass, NgIf } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass, RouterLink],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss'
})
export class SetPasswordComponent {
 
  loading: boolean = true;
  setPasswordForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = "";
  idCliente: string;
  passwordRegex = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,128}$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      this.idCliente = params["idCliente"];
      this.createForm();
    });
  }

  get notValidRepeatPassowrd(): boolean {
    return this.setPasswordForm.get("repeatPassword").touched && this.setPasswordForm.get("repeatPassword").invalid;
  }
  get notValidPassword(): boolean {
    return this.setPasswordForm.get("password").touched && this.setPasswordForm.get("password").invalid;
  }

  createForm(): void {
    this.loading = true;
    this.setPasswordForm = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
      repeatPassword: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
    });
    this.loading = false;
  }

  reestablecer(): void {
    if (this.setPasswordForm.invalid) {
      return;
    }
    if (this.setPasswordForm.get("password").value !== this.setPasswordForm.get("repeatPassword").value) {
      this.alertMessage = "No coincide la contraseña.";
      this.showAlert = true;
      return;
    }
    this.showAlert = false;
    this.setPasswordForm.disable();
    const body = {
      new_password: this.setPasswordForm.get("password").value
    };

    this.authService.reestablecerPassword(this.idCliente, body).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.router.navigate(["auth", "login"]);
    }, err => {
      console.log(err);
    });
    
  }
}
