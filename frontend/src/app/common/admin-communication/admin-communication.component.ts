import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Util } from 'src/app/util/util';
import { ZoomTypeEnum, ConferenceRequest, ZoomParticipantEnum, Conference } from 'src/app/model/conference.model';
import { Chat, ChatTypeEnum } from 'src/app/model/chat.model';
import { ZoomService } from 'src/app/service/zoom.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-admin-communication',
  templateUrl: './admin-communication.component.html',
  styleUrls: ['./admin-communication.component.css']
})
export class AdminCommunicationComponent implements OnInit {
  @ViewChild('dateTimeSelector') 'dateTimeSelector': ElementRef;
  @Input() chatAttachingId: number;
  @Input() chatType: ChatTypeEnum;
  @Input() allowNotes = true;
  @Input() vendorOrderId: number;

  @Input() zoomAttachingId: number;
  @Input() zoomAttachingUserId: number = null;
  @Input() allowScheduling = false;
  @Input() zoomType: ZoomTypeEnum;
  @Input() zoomParticipant = ZoomParticipantEnum.ADMIN;
  @Input() overridText = '';

  zoomTypeEnum = ZoomTypeEnum;
  zoomParticipantEnum = ZoomParticipantEnum;
  conference: Conference = new Conference();
  user;
  startTime;

  chatTypeEnum = ChatTypeEnum;
  chat: Chat;

  constructor(
    public zoomService: ZoomService,
    public toaster: ToastrService,
    public userService: UserService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUserInfo();

    if (this.allowScheduling && !this.zoomAttachingUserId) {
      this.toaster.warning('Zoom Attaching User Id is required. If user allowed to schedule');
      return;
    }

    switch (this.zoomType) {
      case this.zoomTypeEnum.BID_OFFER:
        this.getByBidOrderId();
        break;

      case this.zoomTypeEnum.PART:
        this.getByPartId();
        break;

      case this.zoomTypeEnum.VENDOR_ORDER:
        this.getByVendorOrderId();
        break;

      case this.zoomTypeEnum.CUSTOMER_ORDER:
        this.getByCustomerOrderId();
        break;

      case this.zoomTypeEnum.BID_PM_PROJECT_PROCESS:
        this.getByBidPMProjectProcess();
        break;

      default:
        this.toaster.warning('Invalid zoom type provided.');
        break;
    }
  }

  openDateTimeSelector() {
    if (this.dateTimeSelector) {
      this.dateTimeSelector.nativeElement.click();
    }
  }

  onTimeChanged(event) {
    this.spinner.show();
    const meetingTime = new Date(event).toISOString();
    const conference: ConferenceRequest = {
      hostUserId: this.userService.getUserInfo().id,
      participantUserId: this.zoomAttachingUserId,
      // participantUserId: 388, //"krtest-c1@test.com"

      // partId: 1769,
      partId: this.zoomType === this.zoomTypeEnum.PART ? this.zoomAttachingId : 0,
      // bidOrderId: 0,
      bidOrderId: this.zoomType === this.zoomTypeEnum.BID_OFFER ? this.zoomAttachingId : 0,
      customerOrderId: this.zoomType === this.zoomTypeEnum.CUSTOMER_ORDER ? this.zoomAttachingId : 0,
      vendorOrderId: this.zoomType === this.zoomTypeEnum.VENDOR_ORDER ? this.zoomAttachingId : 0,
      bidPmProjectProcessId: this.zoomType === this.zoomTypeEnum.BID_PM_PROJECT_PROCESS ? this.zoomAttachingId : 0,

      conferenceTopic: 'Meeting for ' + this.zoomType + ' ' + this.zoomAttachingId,
      conferencePassword: this.zoomAttachingId.toString(),
      startTimeInUTC: meetingTime.substr(0, meetingTime.length - 5) + 'Z',
      duration: 1
    };
    this.zoomService.createConference(conference).subscribe(
      (res: Conference) => {
        if (res) {
          this.conference = res;
          this.conference.startTime = new Date(res.startTime).toISOString();
          this.conference.isExpired =
            this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
          this.startTime = new Date(res.startTime).toISOString();
        }
        this.spinner.hide();
        this.toaster.success('Meeting time set.');
      },
      err => {
        console.log({ err });
        this.spinner.hide();
        this.toaster.error('Error while scheduling meeting. Please Contact Admin.');
      }
    );
    // console.log(this.meetingTime);
  }

  getByCustomerOrderId() {
    this.zoomService
      .getConferenceByCustomerOrderId(this.zoomAttachingId.toString(), this.zoomAttachingUserId)
      .subscribe(
        res => {
          this.conference = res;
          if (res) {
            this.conference.isExpired =
              this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
          }
        },
        err => {
          console.log({ err });
          this.toaster.error('Unable to fetch meeting info');
        }
      );
  }
  getByVendorOrderId() {
    this.zoomService.getConferenceByVendorOrderId(this.zoomAttachingId.toString(), this.zoomAttachingUserId).subscribe(
      res => {
        this.conference = res;
        if (res) {
          this.conference.isExpired =
            this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
        }
      },
      err => {
        console.log({ err });
        this.toaster.error('Unable to fetch meeting info');
      }
    );
  }
  getByPartId() {
    this.zoomService.getConferenceByPartId(this.zoomAttachingId.toString(), this.zoomAttachingUserId).subscribe(
      res => {
        this.conference = res;
        if (res) {
          this.conference.isExpired =
            this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
        }
      },
      err => {
        console.log({ err });
        this.toaster.error('Unable to fetch meeting info');
      }
    );
  }
  getByBidOrderId() {
    this.zoomService.getConferenceByBidOrderId(this.zoomAttachingId.toString(), this.zoomAttachingUserId).subscribe(
      res => {
        this.conference = res;
        if (res) {
          this.conference.isExpired =
            this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
        }
      },
      err => {
        console.log({ err });
        this.toaster.error('Unable to fetch meeting info');
      }
    );
  }

  getByBidPMProjectProcess() {
    this.zoomService
      .getConferenceByBidPmProjectProcessId(this.zoomAttachingId.toString(), this.zoomAttachingUserId)
      .subscribe(
        res => {
          this.conference = res;
          if (res) {
            this.conference.isExpired =
              this.conference.isExpired || Util.compareDate(new Date(), new Date(this.conference.startTime)) === 1;
          }
        },
        err => {
          console.log({ err });
          this.toaster.error('Unable to fetch meeting info');
        }
      );
  }
}
