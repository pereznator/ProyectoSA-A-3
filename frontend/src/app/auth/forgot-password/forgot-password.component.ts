import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, FormsModule, NgClass, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  username: string = null;
  showAlert = false;
  alertMessage = "";

  showInfo = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  sendEmail(): void {
    if (!this.username) {
      this.alertMessage = "Ingresar un email valido.";
      this.showAlert = true;
      return;
    }
    if (this.username.length === 0) {
      this.alertMessage = "Ingresar un email valido.";
      this.showAlert = true;
      return;
    }

    this.authService.recuperarPasswordEmail({username: this.username}).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.showInfo = true;
    }, err => {
      console.log(err);
    });
  }
}
