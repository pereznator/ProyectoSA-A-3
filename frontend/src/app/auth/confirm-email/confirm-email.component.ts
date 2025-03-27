import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, FormsModule, NgClass, RouterLink],
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit {

  showAlert = false;
  alertMessage = "";
  token: string = null;
  userId: number;

  showSuccess = false;
  showEmailEnviado = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.token = params["token"];
      if (!this.token) {
        this.router.navigate(["auth", "login"]);
        return;
      }
      this.activatedRoute.queryParams.pipe(take(1)).subscribe(queryParams => {
        this.userId = Number(queryParams["usr"]);
        if (!this.userId || Number.isNaN(this.userId)) {
          this.router.navigate(["auth", "login"]);
          return;
        }
        this.validateToken();
      });
    });
  }

  validateToken(): void {
    this.authService.verificarEmail(this.token).pipe(take(1)).subscribe({
      next: resp => {
        console.log(resp);
        this.showSuccess = true;
        this.showAlert = false;
      },
      error: err => {
        console.log(err);
        this.showSuccess = false;
        this.showAlert = true;
      }
    });
  }

  sendEmail(): void {
    this.authService.registerVerificationEmail({ user_id: this.userId, token: v4() }).pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.showEmailEnviado = true;
    }, err => {
      this.showEmailEnviado = false;
      console.log(err);
    });
  }
}
