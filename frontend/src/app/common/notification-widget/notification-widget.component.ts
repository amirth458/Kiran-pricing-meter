import { Component, OnInit, OnDestroy } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { UserService } from '../../service/user.service';
@Component({
  selector: 'app-notification-widget',
  templateUrl: './notification-widget.component.html',
  styleUrls: ['./notification-widget.component.css']
})
export class NotificationWidgetComponent implements OnInit, OnDestroy {
  unReadCount = { count: 0 };
  interval;
  constructor(
    public toaster: ToastrService,
    public spinner: NgxSpinnerService,
    public route: Router,
    public notificationService: NotificationService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.getCount();
    this.interval = setInterval(() => {
      this.getCount();
    }, 120000);
  }

  unReadCountChanged(unReadCount) {
    this.unReadCount = unReadCount;
  }

  viewAllNotifications() {
    this.route.navigateByUrl('/notification');
  }

  async getCount() {
    try {
      if (this.userService.getUserInfo() && this.userService.getUserInfo().id) {
        this.unReadCount = await this.notificationService.getCount().toPromise();
      }
    } catch (error) {
      console.log(error);
      // this.toaster.error('Can\'t fetch notification count.');
      clearInterval(this.interval);
    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
