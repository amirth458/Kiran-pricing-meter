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
    return this.http.post<any>(url, {
      message,
      phoneNo: phone
    });
  }

  sendVoiceMessage(phone: any, message: string) {
    const url = `${environment.NOTIFICATION_HOST_URL}/twilio/voice`;
    return this.http.post<any>(url, {
      message,
      phoneNo: phone
    });
  }
}
