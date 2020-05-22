import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../service/notification.service.js';
import { FilterOption } from '../../model/vendor.model.js';
import { Notification } from '../../model/notification.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-view-all-notification',
  templateUrl: './view-all-notification.component.html',
  styleUrls: ['./view-all-notification.component.css']
})
export class ViewAllNotificationComponent implements OnInit {
  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = [
    {
      name: 'All Notifications',
      route: '/',
      tooltipMessage: 'All Notifications',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  @Input() tooltip = false;
  @Input() unReadCount: { count: number };
  notifications: Notification[] = null;
  @Output() unReadCountChanged = new EventEmitter<{ count: number }>();
  selectedNotification = {};
  nameMapping = {
    firstName: 'First Name',
    lastName: 'Last Name',
    material: 'Material',
    offerNumber: 'Offer Number',
    offerPrice: 'Offer Price',
    quantity: 'Quantity',
    technology: 'Technology',
    fileName: 'File Name',
    price: 'Price',
    vendor: 'Vendor',
    deliveryDate: 'Delivery Date',
    order: 'Order',

    vendorOrderIdSubOrderId: 'Vendor Sub-Order Id',
    vendorName: 'Vendor Name',
    vendorAccountName: 'Vendor Account Name',
    // loginHrefLink: 'Login Href Link',
    // type: 'Type',
    customerOrderIdSubOrderId: 'Customer Sub-Order Id',
    // loginLinkText: 'Login Link Text',
    vendorAccount: 'Vendor Account',
    partDetails: 'Part Details',
    offerId: 'Offer Id',
    // hrefLink: 'href Link',
    rfq: 'RFQ',
    rfqId: 'rfqId',
    PartId: 'PartId',
    messageDetails: 'Message Details',
    orderStatus: 'Order Status',
    customerName: 'Customer Name',
    customerAccount: 'Customer Account'
    // linkText: 'Link Text',
  };

  constructor(
    public notificationService: NotificationService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService,
    public route: Router
  ) {}

  ngOnInit() {
    this.spinner.show('spooler');
    this.getNotifications();
  }

  setNotificationData(notification: Notification, index: number) {
    this.selectedNotification = null;
    if (notification.message) {
      try {
        this.selectedNotification = JSON.parse(notification.message);
        if (!notification.isRead) {
          this.toggleStatus([notification.id], index);
        }
      } catch (error) {}
    }
  }

  getNotifications() {
    const filter: FilterOption = {
      page: 0,
      size: this.tooltip ? 10 : 1000,
      sort: 'id,desc'
    };
    this.notificationService.getNotification(null, filter).subscribe(
      res => {
        this.notifications = res
          ? res.content.map(i => {
              return { ...i, createdDate: i.createdDate ? new Date(i.createdDate + '+0000') : '' } as any;
            })
          : [];
      },
      err => {
        console.log(err);
        this.toaster.error('Error While Fetching Notifications.');
      }
    );
    this.getCount();
  }

  async getCount() {
    try {
      this.unReadCount = await this.notificationService.getCount().toPromise();
      this.unReadCountChanged.emit(this.unReadCount);
    } catch (error) {
      console.log(error);
    }
  }

  toggleStatus(notificationIds: number[], index: number) {
    const state = !this.notifications[index].isRead;
    this.notificationService.changeReadStatus(state, notificationIds).subscribe(
      res => {
        this.notifications[index].isRead = state;
        if (state === true) {
          --this.unReadCount.count;
        } else {
          ++this.unReadCount.count;
        }
      },
      err => {
        console.log({ err });
        this.toaster.error('Unable to update notification. Please try again.');
      }
    );
  }

  deleteNotification(notificationId: number, index: number) {
    this.notificationService.deleteNotification(notificationId).subscribe(
      res => {
        this.notifications.splice(index, 1);
        this.toaster.success('Notification Removed.');
      },
      err => {
        console.log({ err });
        this.toaster.error('Unable to delete notification. Please try again.');
      }
    );
  }

  markAll() {
    this.notificationService.setAllNotificationMarked((this.unReadCount && this.unReadCount.count) > 0).subscribe(
      res => {
        this.notifications = null;
        this.getNotifications();
        this.toaster.success(this.unReadCount && this.unReadCount.count > 0 ? 'Marked All Read' : 'Marked All Unread');
      },
      err => {
        this.toaster.error('Unable to perform action');
        console.log(err);
      }
    );
  }
}
