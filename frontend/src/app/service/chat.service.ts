import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Chat, ChatTypeEnum, MessageNote } from '../model/chat.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(public http: HttpClient) {}

  buildParameters(id: number, type: number, vendorId: number = null, participants: Array<number> = []) {
    const params: any = {
      chatType: {
        id: type
      },
      bidOrderId: null,
      customerOrderId: null,
      partId: null,
      vendorId,
      vendorOrderId: null,
      participants: null
    };
    switch (type) {
      case ChatTypeEnum.VENDOR_ORDER:
        params.vendorOrderId = id;
        params.participants = participants;
        break;
      case ChatTypeEnum.BID_OFFER:
        params.bidOrderId = id;
        params.participants = participants;
        break;
      case ChatTypeEnum.PART_NOTE:
        params.partId = id;
        params.participants = participants;
        break;
      case ChatTypeEnum.CUSTOMER_ORDER:
        params.customerOrderId = id;
        break;
    }
    return params;
  }

  getChat(id: number, type: number, vendorId: number = null, participants: Array<number> = []): Observable<Chat> {
    return this.http.post<Chat>(
      `${environment.procurementApiBaseUrl}/chat`,
      this.buildParameters(id, type, vendorId, participants)
    );
  }

  create(id: number, type: number, vendorId: number = null, participants: Array<number> = []): Observable<Chat> {
    return this.http.post<Chat>(
      `${environment.procurementApiBaseUrl}/chat/create-chat`,
      this.buildParameters(id, type, vendorId, participants)
    );
  }

  addMessage(text: string, chatId: number): Observable<MessageNote> {
    return this.http.post<MessageNote>(`${environment.procurementApiBaseUrl}/chat/add-message`, {
      chat: {
        id: chatId
      },
      message: text
    });
  }
}
