import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BillingService } from 'src/app/service/billing.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentDetails, PaymentStatusTypes, PaymentType } from 'src/app/model/billing.model';
import { MetadataConfig } from '../../../../model/metadata.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { Util } from '../../../../util/Util';

@Component({
  selector: 'app-purchase-order-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.css']
})
export class PurchaseOrderItemComponent implements OnInit {
  PaymentStatusTypes = PaymentStatusTypes;
  chatForm = this.fb.group({
    note: ['', Validators.required]
  });
  messageList = [];
  showPaymentDetails = false;
  selectedPurchaseOrderId = null;
  paymentOrderType = PaymentType;

  userInfo;
  orderInfo: PaymentDetails;
  postProcessAction = [];
  measurementUnits = [];
  constructor(
    public toast: ToastrService,
    public location: Location,
    public modalService: NgbModal,
    public route: Router,
    public billingService: BillingService,
    public metadataService: MetadataService,
    public fb: FormBuilder,
    public userService: UserService,
    public spinner: NgxSpinnerService
  ) {
    this.selectedPurchaseOrderId = this.route.url.split('/').pop();
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.spinner.show();
    this.billingService.getPaymentInfo(this.selectedPurchaseOrderId).subscribe(
      (res: PaymentDetails) => {
        this.orderInfo = res;
        if (this.orderInfo) {
          this.messageList = [];
          if (this.orderInfo.billingInfoView && this.orderInfo.billingInfoView.purchaseAgreement) {
            this.messageList = this.orderInfo.billingInfoView.purchaseAgreement.purchaseAgreementNoteViewList || [];
          }
          this.messageList = this.messageList.reverse();
        } else {
          this.toast.error('Something went wrong. Please try again later.');
          this.route.navigateByUrl('/billing/payment/waiting-for-approval');
        }
        this.spinner.hide();
      },
      err => {
        console.log({ err });
        this.spinner.hide();
        this.toast.error(err.error.message);
        this.route.navigateByUrl('/billing/payment');
      }
    );
    this.metadataService
      .getAdminMetaData(MetadataConfig.POST_PROCESS_ACTION)
      .subscribe(res => (this.postProcessAction = res));
    this.metadataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.measurementUnits = res;
    });
  }

  open(content, size: any = 'lg') {
    this.modalService
      .open(content, {
        size,
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      })
      .result.then(
        result => {},
        reason => {}
      );
  }

  togglePaymentInfo() {
    this.showPaymentDetails = !this.showPaymentDetails;
  }

  approvePurchase() {
    const body = {
      orderId: this.orderInfo.billingInfoView.orderId,
      paymentStatusType: this.orderInfo.billingInfoView.paymentStatusType,
      paymentType: this.orderInfo.billingInfoView.paymentType,
      poNumber: this.orderInfo.billingInfoView.purchaseAgreement.poaNumber
    };
    this.billingService.approveOrder(body).subscribe(
      res => {
        this.modalService.dismissAll();
        this.toast.success('Purchase Approved.');
        this.route.navigateByUrl('/billing/payment/waiting-for-approval');
      },
      err => {
        console.log({ err });
        this.modalService.dismissAll();
        this.toast.error(err.error.message);
        this.route.navigateByUrl('/billing/payment/waiting-for-approval');
      }
    );
  }

  rejectPurchase() {
    const body = {
      orderId: this.orderInfo.billingInfoView.orderId,
      paymentStatusType: this.orderInfo.billingInfoView.paymentStatusType,
      paymentType: this.orderInfo.billingInfoView.paymentType,
      poNumber: this.orderInfo.billingInfoView.purchaseAgreement.poaNumber
    };
    this.billingService.rejectOrder(body).subscribe(
      res => {
        console.log({ res });
        this.modalService.dismissAll();
        this.toast.success('Purchase Rejected.');
        this.route.navigateByUrl('/billing/payment/waiting-for-approval');
      },
      err => {
        console.log({ err });
        this.modalService.dismissAll();
        this.toast.error(err.error.message);
        this.route.navigateByUrl('/billing/payment/waiting-for-approval');
      }
    );
  }

  formatPaymentType(paymentType: string) {
    return paymentType ? paymentType.replace('_', ' ') : '';
  }

  sendNote() {
    if (!this.chatForm.valid) {
      this.toast.warning('Please enter note to send');
      return;
    }

    this.billingService.addNote(this.chatForm.value.note, this.orderInfo.billingInfoView.orderId).subscribe(
      res => {
        console.log({ res });
        this.messageList = res.reverse();
        this.toast.success('Note Sent');
        this.chatForm.reset();
      },
      err => {
        console.log({ err });
        this.toast.error(err.error.message);
      }
    );
  }

  preparePostProcessValues(ids: Array<number>) {
    return Util.preparePostProcessValues(this.postProcessAction, ids);
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
