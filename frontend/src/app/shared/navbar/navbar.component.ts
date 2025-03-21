import { Component, OnInit } from '@angular/core';
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
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  user: User;
  loading: boolean = true;

  constructor(
    private router: Router,
    private authSerivce: AuthService
  ) {
  }

  
  ngOnInit(): void {
    this.loading = true;
    this.authSerivce.user$.subscribe(user => {
      this.user = user;
      console.log(this.user);
      this.loading = false;
    }, err => {
      console.log(err);
    });
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
    if (this.user.tipoUsuario === "CLIENTE") {
      this.router.navigate(["cliente", "perfil"])
    } else if (this.user.tipoUsuario === "ADMINISTRADOR") {
      this.router.navigate(["admin", "perfil"])
    }
  }

}
