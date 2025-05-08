import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

export enum RequestMethod {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

@Injectable({ providedIn: "root" })
export class HttpService {

  constructor(private httpClient: HttpClient) {}

  public request(method: RequestMethod, url: string, body?: any, params?: any): Observable<any> {
    let requestObservable: Observable<any>;
    switch (method) {
      case RequestMethod.GET:
      requestObservable = this.httpClient.get(url, { params });
      break;
      case RequestMethod.POST:
      requestObservable = this.httpClient.post(url, body, { params });  
      break;
      case RequestMethod.PUT:
      requestObservable = this.httpClient.put(url, body, { params });  
      break;
      case RequestMethod.PATCH:
      requestObservable = this.httpClient.patch(url, body, { params });  
      break;
      case RequestMethod.DELETE:
      requestObservable = this.httpClient.delete(url, { params, body });  
      break;
    }
    return requestObservable;
  }
}