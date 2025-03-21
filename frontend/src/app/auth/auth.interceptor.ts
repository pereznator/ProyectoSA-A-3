import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  let newReq = req.clone();

  if (authService.token) {
      newReq = req.clone({
          headers: req.headers.set('authorization', `Bearer ${authService.token}`),
      });
  }

  // Response
  return next(newReq).pipe(
      catchError((error) => {
          // Catch "401 Unauthorized" responses
          if (error instanceof HttpErrorResponse && error.status === 401) {
              // Sign out
              authService.signOut();

              // Reload the app
              location.reload();
          }

          return throwError(error);
      })
  );
};