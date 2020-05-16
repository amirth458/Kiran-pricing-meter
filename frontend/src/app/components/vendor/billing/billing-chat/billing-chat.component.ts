import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { UserService } from 'src/app/service/user.service';
import { BillingService } from 'src/app/service/billing.service';
import { PaymentDetails, PaymentStatusTypes } from 'src/app/model/billing.model';

@Component({
  selector: 'app-billing-chat',
  templateUrl: './billing-chat.component.html',
  styleUrls: ['./billing-chat.component.css']
})
export class BillingChatComponent implements OnInit {
  @Input() purchaseOrderId;

  userInfo;
  messageList;
  orderInfo;
  paymentStatusType;
  loading = false;
  PaymentStatusTypes = PaymentStatusTypes;

  chatForm = this.fb.group({
    note: ['', Validators.required]
  });

  constructor(
    public userService: UserService,
    public billingService: BillingService,
    public toast: ToastrService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userInfo = this.userService.getUserInfo();
  }

  get canSendMessage() {
    return (
      this.paymentStatusType &&
      (this.paymentStatusType === PaymentStatusTypes.WAITING_FOR_APPROVAL ||
        this.paymentStatusType === PaymentStatusTypes.REJECTED)
    );
  }

  openChat($event) {
    $event.preventDefault();
    $event.stopPropagation();

    this.loading = true;
    this.billingService.getPaymentInfo(this.purchaseOrderId).subscribe(
      (res: PaymentDetails) => {
        this.orderInfo = res;
        if (this.orderInfo) {
          this.messageList = [];
          if (this.orderInfo.billingInfoView && this.orderInfo.billingInfoView.purchaseAgreement) {
            this.messageList = this.orderInfo.billingInfoView.purchaseAgreement.purchaseAgreementNoteViewList || [];
            this.paymentStatusType = this.orderInfo.billingInfoView.paymentStatusType;
          }
          this.messageList = (this.messageList || []).reverse();
        } else {
          this.toast.error('Something went wrong. Please try again later.');
        }
        this.loading = false;
      },
      err => {
        this.loading = false;
        console.log(err);
        this.toast.error('Something went wrong. Please try again later.');
      }
    );
  }

  sendNote() {
    if (!this.chatForm.valid) {
      this.toast.warning('Please enter note to send');
      return;
    }

    this.billingService.addNote(this.chatForm.value.note, this.orderInfo.billingInfoView.orderId).subscribe(
      res => {
        console.log({ res });
        this.messageList = (res || []).reverse();
        this.toast.success('Note Sent');
        this.chatForm.reset();
      },
      err => {
        console.log({ err });
        this.toast.error('Something went wrong. Please try again later.');
      }
    );
  }

  isDifferentDate(index: number) {
    if (index == 0) {
      return false;
    }
    const current = this.messageList[index].createdDate;
    const prev = this.messageList[index - 1].createdDate;
    if (!current || !prev) {
      return false;
    }

    const currentDate = new Date(this.messageList[index].createdDate);
    const prevDate = new Date(this.messageList[index - 1].createdDate);

    if (
      currentDate.getDate() == prevDate.getDate() &&
      currentDate.getDate() == prevDate.getDate() &&
      currentDate.getDate() == prevDate.getDate()
    ) {
      return true;
    }

    return false;
  }
}
