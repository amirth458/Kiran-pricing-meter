import { Component, OnInit } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationSetting, MessageTypeEnum, CommunicationTypesEnum } from 'src/app/model/notification.model';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.css']
})
export class NotificationSettingComponent implements OnInit {
  switchColor = {
    color: '#74bf09',
    switchColor: '#f8fdf0',
    defaultBgColor: '#a9a9a954',
    defaultBoColor: 'transparent'
  };

  messageTypeList: { onScreen: NotificationSetting[]; email: NotificationSetting[] } = {
    onScreen: [],
    email: []
  };
  messageTypes = [];
  messageTypeEnum = MessageTypeEnum;
  allNotificationSettingIndex = null;

  constructor(
    public notificationService: NotificationService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    combineLatest(
      this.notificationService.getNotificationSettingByUserId(CommunicationTypesEnum.ON_SCREEN),
      this.notificationService.getNotificationSettingByUserId(CommunicationTypesEnum.Email),
      this.notificationService.getMessageType()
    )
      .pipe(catchError(e => this.handleHttpError(e)))
      .subscribe(([onScreenSetting, emailSetting, type]) => {
        this.messageTypes = type.metadataList;

        this.messageTypeList = {
          onScreen: onScreenSetting.map(settingItem => {
            const messageType = this.getMessageType(settingItem.messageTypeId);
            return {
              ...settingItem,
              name: messageType.length ? messageType[0].description : ''
            };
          }),
          email: emailSetting.map(settingItem => {
            const messageType = this.getMessageType(settingItem.messageTypeId);
            return {
              ...settingItem,
              name: messageType.length ? messageType[0].description : ''
            };
          })
        };

        this.allNotificationSettingIndex = this.messageTypeList.email.findIndex(
          _ => _.messageTypeId === this.messageTypeEnum.NOTIFICATION_ALL
        );

        if (this.messageTypeList.email[this.allNotificationSettingIndex].enableNotification) {
          this.checkAllByType(true, 'email');
        }

        if (this.messageTypeList.onScreen[this.allNotificationSettingIndex].enableNotification) {
          this.checkAllByType(true, 'onScreen');
        }

        this.spinner.hide();
      });
  }

  get isAllOnScreenChecked() {
    return this.messageTypeList.onScreen[this.allNotificationSettingIndex].enableNotification;
  }

  get isAllEmailChecked() {
    return this.messageTypeList.email[this.allNotificationSettingIndex].enableNotification;
  }

  getMessageType(messageTypeId) {
    return this.messageTypes.filter(item => item.id === messageTypeId);
  }

  checkAllByType(checked, type) {
    this.messageTypeList[type].map((item, index) => {
      this.messageTypeList[type][index].enableNotification = checked;
    });
  }

  checkOneByType(checked, type, index) {
    this.messageTypeList[type][index].enableNotification = checked;
    if (!checked) {
      this.messageTypeList[type][this.allNotificationSettingIndex].enableNotification = false;
    }
  }

  save() {
    this.spinner.show();
    combineLatest(
      this.notificationService.updateNotificationSetting(
        CommunicationTypesEnum.ON_SCREEN,
        this.messageTypeList.onScreen
      ),
      this.notificationService.updateNotificationSetting(CommunicationTypesEnum.Email, this.messageTypeList.email)
    ).subscribe(
      ([firstResult, secondResult]) => {
        this.spinner.hide();
        this.toaster.success('Notification Setting Saved!');
      },
      err => {
        this.toaster.error('Error Occured While Saving Settings.');
        this.spinner.hide();
      }
    );
  }
  handleHttpError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.spinner.hide();
    this.toaster.error(`${message} : Error`);
    return throwError('Error');
  }
}
