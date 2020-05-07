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

  messageList = [];
  showPaymentDetails = false;
  loadingPanel = false;
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
      poNumber: this.orderInfo.billingInfoView.purchaseAgreement
        ? this.orderInfo.billingInfoView.purchaseAgreement.poaNumber
        : null
    };
    this.loadingPanel = true;
    this.spinner.show('spooler');
    this.billingService.approveOrder(body).subscribe(
      res => {
        this.closeModalWindow();
        this.toast.success('Purchase Approved.');
        this.route.navigateByUrl('/billing/payment/waiting-for-approval');
      },
      err => {
        this.closeModalWindow();
        this.toast.error(err.error.message);
        this.route.navigateByUrl('/billing/payment/waiting-for-approval');
      }
    );
  }

  closeModalWindow() {
    this.spinner.hide('spooler');
    this.modalService.dismissAll();
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

  preparePostProcessValues(ids: Array<number>) {
    return Util.preparePostProcessValues(this.postProcessAction, ids);
  }
}
