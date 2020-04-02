import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public http: HttpClient) {}

  sendMessage(from, to, cc, bcc, subject, body, bodyMessageType = 'TEXT', communicationType = 'Email') {
    const url = `${environment.apiBaseUrl}/admin/notification`;
    return this.http.post(url, {
      from,
      to,
      cc,
      bcc,
      subject,
      body,
      bodyMessageType,
      communicationType
    });
  }
}
