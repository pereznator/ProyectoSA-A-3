import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private serverUrl: string = environment.authServerUrl;
  private bucketName: string = "software-avanzado-bucket";

  constructor(private httpClient: HttpClient) {}

  generateUploadUrl(file: File, key: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const params = new HttpParams()
        .set('filename', key)
        .set('contentType', file.type);

      // Paso 1: obtener la URL firmada desde el backend
      this.httpClient.get(`${this.serverUrl}/generate-upload-url`, { params }).subscribe({
        next: (response: any) => {
          const signedUrl = response.url;

          // Paso 2: subir el archivo con PUT a la URL firmada
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', signedUrl);
          xhr.setRequestHeader('Content-Type', file.type);

          xhr.onload = () => {
            if (xhr.status === 200) {
              const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${key}`;
              observer.next(publicUrl);
              observer.complete();
            } else {
              observer.error({ message: 'Error al subir archivo', status: xhr.status });
            }
          };

          xhr.onerror = (err) => {
            console.log(err);
            observer.error({ message: 'Error de red al subir archivo' });
          };

          xhr.send(file);
        },
        error: err => {
          observer.error({ message: 'Error al obtener URL firmada', error: err });
        }
      });
    });
  }

}
