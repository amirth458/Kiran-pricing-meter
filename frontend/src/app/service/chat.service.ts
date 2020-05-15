import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Chat, ChatAttachment, ChatAttachmentView, ChatTypeEnum, ChatView, MessageNote } from '../model/chat.model';
import { environment } from '../../environments/environment';
import { UserSummary } from '../model/user.model';

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
    return this.http
      .post<ChatView>(
        `${environment.procurementApiBaseUrl}/chat`,
        this.buildParameters(id, type, vendorId, participants)
      )
      .pipe(map(chatView => this.parseChat(chatView)));
  }

  parseChat(chatView: ChatView): Chat {
    const chat: Chat = chatView ? chatView.chat : null;
    if (chat) {
      chat.users = chatView.users;
      const users = (chatView.users || []).reduce((obj: any, value: UserSummary) => {
        obj[value.id] = value;
        return obj;
      }, {});
      chat.messageNotes = (chatView.chat.messageNotes || []).map(note => {
        note.user = users[note.senderId];
        return note;
      });
    }
    return chat || null;
  }

  create(id: number, type: number, vendorId: number = null, participants: Array<number> = []): Observable<Chat> {
    return this.http
      .post<ChatView>(
        `${environment.procurementApiBaseUrl}/chat/create-chat`,
        this.buildParameters(id, type, vendorId, participants)
      )
      .pipe(map(chatView => this.parseChat(chatView)));
  }

  addMessage(text: string, chatId: number): Observable<MessageNote> {
    return this.http.post<MessageNote>(`${environment.procurementApiBaseUrl}/chat/add-message`, {
      chat: {
        id: chatId
      },
      message: text
    });
  }

  markUnreadMessage(id: number): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.procurementApiBaseUrl}/chat/message-note/${id}/mark-read`, null);
  }

  uploadAttachment(chatId: number, file: File): Observable<ChatAttachment> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name.replace(/(?:\.(?![^.]+$)|[^\w.])+/g, '_'));
    return this.http.post<ChatAttachment>(`${environment.procurementApiBaseUrl}/chat-attachments/${chatId}`, formData);
  }

  getAllChatAttachments(chatId: number): Observable<ChatAttachmentView> {
    return this.http.get<ChatAttachmentView>(`${environment.procurementApiBaseUrl}/chat-attachments/${chatId}`);
  }

  deleteChatAttachment(chatId: number, attachmentId: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.procurementApiBaseUrl}/chat-attachments/${chatId}/attachment/${attachmentId}`
    );
  }
}
