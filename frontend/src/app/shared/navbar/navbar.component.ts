import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NgClass, NgIf } from '@angular/common';
import { take } from 'rxjs';
import { User } from '../../auth/auth.types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class NavbarComponent implements OnInit {

  user: any;
  loading: boolean = true;

  constructor(
    private router: Router,
    private authSerivce: AuthService
  ) {
  }

  
  ngOnInit(): void {
    this.loading = true;
    this.authSerivce.currentUser$.subscribe(user => {
      this.user = user;
      this.loading = false;
    }, err => {
      console.log("NAVBAR ERROR", err);
      console.log(err);
    });
    // this.authSerivce.user$.subscribe(user => {
    //   console.log("NAVBAR", this.user);
    // }, err => {
    // });
  }

  cerrarSesion(): void {
    this.authSerivce.signOut().pipe(take(1)).subscribe(resp => {
      this.user = null;
      this.router.navigate(["auth", "login"]);
    }, err => {
      console.log(err);
    });
  }

  irAPerfil(): void {
    if (this.user.role === "user") {
      this.router.navigate(["cliente", "perfil"])
    } else if (this.user.role === "admin") {
      this.router.navigate(["admin", "perfil"])
    }
  }

}
