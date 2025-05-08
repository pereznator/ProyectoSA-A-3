import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ReplaySubject, catchError, of, switchMap, take, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { User } from "./auth.types";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { jwtDecode } from 'jwt-decode';
import { CookieService } from "ngx-cookie-service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private authServerUrl: string = environment.authServerUrl;
  private authenticated = false;
  private tokenSubject: BehaviorSubject<string>;
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService) {
    this.tokenSubject = new BehaviorSubject<string>(null);
    this.loadUserFromToken();
  }

  loadUserFromToken() {
    const token = this.cookieService.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        this.currentUserSubject.next(decoded);
      } catch (err) {
        console.error('Token inválido', err);
        this.signOut();
      }
    } else {
      console.log("no token");
    }
  }

  get token(): string {
    return this.tokenSubject.value;
  }

  set user(value: User) {
    this._user.next(value);
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  login(body: any): Observable<any> {
    return this.httpClient.post(`${this.authServerUrl}/api/auth/iniciar-sesion`, body, { withCredentials: true }).pipe(
      switchMap((response: any) => {
        this.getUser(response.user_id).pipe(take(1)).subscribe(userResponse => {
          const user = {
            id: userResponse.user_id,
            first_name: userResponse.first_name,
            last_name: userResponse.last_name,
            email: userResponse.email,
            username: userResponse.username,
            password: '', // No viene en la respuesta, puedes dejarlo vacío o null
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
            }))
          };
          this.user = user;
          this.currentUserSubject.next(user);
        }, err => {
          console.log(err);
        });
        this.authenticated = true;
        return of(response);
      })
    );
  }

  loginWithRefreshToken(): Observable<any> {
    return this.httpClient.get(`${this.authServerUrl}/api/auth/validar-token`, { withCredentials: true }).pipe(
      catchError((err) => {
        console.log(err);
        this.cookieService.delete('token', '/');
        this.router.navigate(["auth", "login"]);
        return of(false)
      }),
      switchMap((response: any) => {
        // if (response.RefreshToken) {
        //   this.refreshToken = response.RefreshToken;
        // }
        // this.tokenSubject.next(response.AccessToken);
        this.getUser(response.user_id).pipe(take(1)).subscribe(userResponse => {
          const user = {
            id: userResponse.user_id,
            first_name: userResponse.first_name,
            last_name: userResponse.last_name,
            email: userResponse.email,
            username: userResponse.username,
            password: '', // No viene en la respuesta, puedes dejarlo vacío o null
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
            }))
          };
          this.user = user;
          this.currentUserSubject.next(user);
        }, err => {
          console.log(err);
        });
        this.authenticated = true;
        return of(true);
      })
    );
  }

  register(body: any): Observable<any> {
    return this.httpClient.post(`${this.authServerUrl}/api/user/crear-usuario`, body);
  }

  verificarEmail(token: string): Observable<any> {
    return this.httpClient.post(`${this.authServerUrl}/api/auth/verificar-correo`, { token });
  }

  desactivar(username: string): Observable<any> {
    return this.httpClient.get(`${this.authServerUrl}/cliente/desactivar/${username}`);
  }

  recuperarPasswordEmail(body: any): Observable<any> {
    return this.httpClient.post(`${this.authServerUrl}/cliente/send-recovery`, body);
  }

  reestablecerPassword(idSub: string, body: any): Observable<any> {
    return this.httpClient.put(`${this.authServerUrl}/cliente/${idSub}/reset-pwd`, body);
  }

  getUser(userId: string): Observable<any> {
    return this.httpClient.get(`${this.authServerUrl}/api/user/obtener-usuario-por-id/${userId}`, { withCredentials: true }).pipe(
      catchError((err) => {
        console.log(err);
        return of(false);
      }),
      switchMap((response: any) => {
        return of(response.usuario);
      })
    )
  }

  signOut(): Observable<any> {
    return this.currentUser$.pipe(
      take(1),
      switchMap(user => {
        return this.httpClient.put(`${this.authServerUrl}/api/auth/cerrar-sesion`, { user_id: user.id }, { withCredentials: true }).pipe(
          catchError((err) => {
            console.log(err);
            return of(false);
          }),
          switchMap(response => {
            console.log(response);
            // Remove the access token from the local storage
            // localStorage.removeItem('refreshToken');
        
            // Set the authenticated flag to false
            this.authenticated = false;
            this.tokenSubject.next(null);
            this.user
            this.cookieService.delete('token', '/');
            // Return the observable
            return of(response);
          })
        );
      })
    );
  }

  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this.authenticated) {
        return of(true);
    }

    // Check the access token availability
    if (!this.cookieService.get("token")) {
        return of(false);
    }

    // If the access token exists, and it didn't expire, sign in using it
    return this.loginWithRefreshToken();
  }

  // obtenerCookie(nombre: string): string | null {
  //   const cookies = document.cookie.split(';');
  //   for (let cookie of cookies) {
  //     const [key, value] = cookie.trim().split('=');
  //     if (key === nombre) {
  //       return decodeURIComponent(value);
  //     }
  //   }
  //   return null;
  // }

  registerVerificationEmail(body: any): Observable<any> {
    return this.httpClient.post(`${this.authServerUrl}/api/auth/registrar-verificacion-email`, body);
  }
  
  actualizarPerfil(body: any): Observable<any> {
    return this.httpClient.put(`${this.authServerUrl}/api/user/actualizar-perfil-usuario`, body);
  }

  activarUsuario(body: any): Observable<any> {
    return this.httpClient.put(`${this.authServerUrl}/api/user/activar-usuario`, body);
  }
  desactivarUsuario(body: any): Observable<any> {
    return this.httpClient.put(`${this.authServerUrl}/api/user/desactivar-usuario`, body);
  }
}
