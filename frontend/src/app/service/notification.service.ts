import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MetadataType, NotificationSetting, Notification } from '../model/notification.model';
import { UserService } from './user.service';
import { FilterOption } from '../model/vendor.model';
import { Pageable } from '../model/pageable.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public http: HttpClient, public userService: UserService) {}

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

  getMessageType(): Observable<MetadataType> {
    return this.http.get<MetadataType>(environment.NOTIFICATION_HOST_URL + '/notification/metadata/message_type');
  }

  getCommunicationType(): Observable<MetadataType> {
    return this.http.get<MetadataType>(environment.NOTIFICATION_HOST_URL + '/notification/metadata/communication_type');
  }

  getNotificationSettingByUserId(
    userId: number = this.userService.getUserInfo().id
  ): Observable<NotificationSetting[]> {
    const params = new HttpParams().append('user-id', userId.toString()).append('notification-user', 'Admin');
    return this.http.get<NotificationSetting[]>(
      environment.NOTIFICATION_HOST_URL + '/notification/notification-settings',
      { params }
    );
  }

  updateNotificationSetting(
    communicationTypeId: number,
    notificationSetting: NotificationSetting[],
    userId = this.userService.getUserInfo().id
  ) {
    const body = {
      communicationTypeId,
      userId,
      mesaageTypeRequest: notificationSetting.map(i => {
        return {
          messageTypeId: i.messageTypeId,
          enableNotification: i.enableNotification
        };
      })
    };
    return this.http.post(environment.NOTIFICATION_HOST_URL + '/notification/notification-setting/all', body);
  }

  getNotification(
    isRead: boolean,
    filter: FilterOption = null,
    userId = this.userService.getUserInfo().id
  ): Observable<Pageable<Notification>> {
    let params = new HttpParams().append('user-id', userId.toString());
    if (filter) {
      params = params.append('page', filter.page.toString());
      params = params.append('size', filter.size.toString());
      params = params.append('sort', filter.sort.toString());
    }
    if (isRead) {
      params = params.append('is-read', isRead.valueOf.toString());
    }
    return this.http.get<Pageable<Notification>>(environment.NOTIFICATION_HOST_URL + '/notification', { params });
  }

  changeReadStatus(isRead: boolean, notificationIds: number[], userId = this.userService.getUserInfo().id) {
    const body = {
      notificationIds,
      isRead,
      userId
    };
    return this.http.put<NotificationSetting[]>(environment.NOTIFICATION_HOST_URL + '/notification', body);
  }

  deleteNotification(notificationId: number, userId = this.userService.getUserInfo().id) {
    '/notification?notification-id=1&user-id=390';
    const params = new HttpParams()
      .append('user-id', userId.toString())
      .append('notification-id', notificationId.toString());
    return this.http.delete<NotificationSetting[]>(environment.NOTIFICATION_HOST_URL + '/notification', { params });
  }
  getCount(
    isRead = false,
    userId = this.userService.getUserInfo() ? this.userService.getUserInfo().id : false
  ): Observable<{ count: number }> {
    const params = new HttpParams().append('user-id', userId.toString()).append('is-read', isRead.toString());
    return this.http.get<{ count: number }>(environment.NOTIFICATION_HOST_URL + '/notification/count', { params });
  }

  setAllNotificationMarked(isRead: boolean, userId = this.userService.getUserInfo().id) {
    const body = {
      userId,
      isRead
    };
    return this.http.put(environment.NOTIFICATION_HOST_URL + '/notification/mark-all', body);
  }
}
