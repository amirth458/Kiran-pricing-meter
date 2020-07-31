import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(public http: HttpClient) {}

  sendTextMessage(phone: any, message: string) {
    const url = `${environment.NOTIFICATION_HOST_URL}/twilio/sms`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(
      url,
      {
        message,
        phoneNo: phone
      },
      {
        headers
      }
    );
  }

  sendVoiceMessage(phone: any, message: string) {
    const url = `${environment.NOTIFICATION_HOST_URL}/twilio/voice`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(
      url,
      {
        message,
        phoneNo: phone
      },
      {
        headers
      }
    );
  }
}
