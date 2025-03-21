import { Injectable } from '@angular/core';
import AWS from "aws-sdk";
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  private S3: any;

  constructor() {
    AWS.config.update({
      accessKeyId: '',
      secretAccessKey: '',
      region: ""
    });
    this.S3 = new AWS.S3();
  }

  uploadFileToBucket(file: File, bucketName: string, keyName: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const params = {
        Bucket: bucketName,
        Key: keyName,
        Body: file,
        ContentType: file.type
      };

      this.S3.upload(params, (err: any, data: any) => {
        if (err) {
          observer.error(err);
          observer.complete();
        } else {
          observer.next(data);
          observer.complete();
        }
      });
    });
  }

}
