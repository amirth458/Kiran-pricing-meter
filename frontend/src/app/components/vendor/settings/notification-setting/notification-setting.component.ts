import { Component, OnInit } from '@angular/core';
import { combineLatest, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationSetting, CommunicationTypesEnum } from 'src/app/model/notification.model';
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

  messageTypeList: NotificationSetting[] = [];

  constructor(
    public notificationService: NotificationService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    combineLatest(this.notificationService.getNotificationSettingByUserId(), this.notificationService.getMessageType())
      .pipe(catchError(e => this.handleHttpError(e)))
      .subscribe(([setting, type]) => {
        this.messageTypeList = setting
          .filter(i => i.communicationTypeId === CommunicationTypesEnum.ON_SCREEN)
          .map(settingItem => {
            const messageType = type.metadataList.filter(item => item.id === settingItem.messageTypeId);
            return { ...settingItem, name: messageType.length ? messageType[0].description : '' };
          });
        this.spinner.hide();
      });
  }

  get isAllChecked() {
    return this.messageTypeList.filter(i => i.enableNotification === false).length === 0;
  }

  checkAll(checked) {
    this.messageTypeList.map((item, index) => {
      this.messageTypeList[index].enableNotification = checked;
    });
  }

  save() {
    this.spinner.show();
    this.notificationService
      .updateNotificationSetting(CommunicationTypesEnum.ON_SCREEN, this.messageTypeList)
      .subscribe(
        res => {
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
    this.toaster.error(`${message} Please contact your admin`);
    return throwError('Error');
  }
}
