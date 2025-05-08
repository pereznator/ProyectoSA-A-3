import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpService, RequestMethod } from '../http.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  url = environment.chatServiceUrl;
  constructor(
    private httpService: HttpService
  ) {

  }
  private chatVisible = new BehaviorSubject<boolean>(false);
  chatVisible$ = this.chatVisible.asObservable();

  toggleChat(): void {
    this.chatVisible.next(!this.chatVisible.getValue());
  }

  closeChat(): void {
    this.chatVisible.next(false);
  }

  sendMessage(message: string, userId: string): Observable<any> {

    return this.httpService.request(RequestMethod.POST, `${this.url}/chat`, { mensaje: message, user_id: userId });
  }
}
