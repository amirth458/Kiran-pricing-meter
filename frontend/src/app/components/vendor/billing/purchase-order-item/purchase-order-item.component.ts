import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, TitleCasePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { BillingService } from 'src/app/service/billing.service';
import { PaymentDetails, PaymentStatusTypes, PaymentType } from 'src/app/model/billing.model';
import { MetadataConfig } from '../../../../model/metadata.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { UserService } from 'src/app/service/user.service';
import { Util } from '../../../../util/Util';
import { Chat, ChatTypeEnum, ChatParticipantEnum } from 'src/app/model/chat.model';

@Component({
  selector: 'app-purchase-order-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.css']
})
export class PurchaseOrderItemComponent implements OnInit {
  PaymentStatusTypes = PaymentStatusTypes;

  messageList = [];
  showPaymentDetails = false;
  loadingPanel = false;
  selectedPurchaseOrderId = null;
  paymentOrderType = PaymentType;

  userInfo;
  orderInfo: PaymentDetails;
  postProcessAction = [];
  measurementUnits = [];

  chat: Chat;
  chatTypeEnum = ChatTypeEnum;
  chatParticipantEnum = ChatParticipantEnum;
  constructor(
    public toast: ToastrService,
    public location: Location,
    public modalService: NgbModal,
    public route: Router,
    public billingService: BillingService,
    public metadataService: MetadataService,
    public fb: FormBuilder,
    public userService: UserService,
    public spinner: NgxSpinnerService,
    public titleCasePipe: TitleCasePipe
  ) {
    this.selectedPurchaseOrderId = this.route.url.split('/').pop();
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
        this.spinner.hide();
        this.toast.error('Error While Fetching Payment Info.');
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

  approve() {
    this.loadingPanel = true;
    this.spinner.show('spooler');
    this.billingService.approve(this.orderInfo.billingInfoView.orderId).subscribe(
      () => this.onSuccess('Purchase Approved.', '/billing/payment/waiting-for-approval'),
      () => this.onFailed('Error While Approving Purchase.', '/billing/payment/waiting-for-approval')
    );
  }

  getPaymentType(paymentType: PaymentType) {
    const paymentTypeTitle = this.titleCasePipe.transform((paymentType || '').toString().replace(/_/g, ' '));
    return `${paymentType === this.paymentOrderType.CREDIT_CARD ? `${paymentTypeTitle} Order` : paymentTypeTitle}`;
  }

  onSuccess(text: string, url: string) {
    this.closeModalWindow();
    this.toast.success(text);
    this.route.navigateByUrl(url);
  }

  onFailed(errText: string, url: string) {
    this.closeModalWindow();
    this.toast.error(errText);
    this.route.navigateByUrl(url);
  }

  closeModalWindow() {
    this.spinner.hide('spooler');
    this.modalService.dismissAll();
  }

  reject() {
    this.loadingPanel = true;
    this.spinner.show('spooler');
    this.billingService.reject(this.orderInfo.billingInfoView.orderId).subscribe(
      () => this.onSuccess('Purchase Rejected.', '/billing/payment/waiting-for-approval'),
      () => this.onFailed('Error While Rejecting Purchase.', '/billing/payment/waiting-for-approval')
    );
  }

  formatPaymentType(paymentType: string): string {
    return this.titleCasePipe.transform((paymentType || '').replace(/_/g, ' '));
  }

  preparePostProcessValues(ids: Array<number>) {
    return Util.preparePostProcessValues(this.postProcessAction, ids);
  }
}
