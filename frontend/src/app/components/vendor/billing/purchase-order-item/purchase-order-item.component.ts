import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-purchase-order-item',
  templateUrl: './purchase-order-item.component.html',
  styleUrls: ['./purchase-order-item.component.css']
})
export class PurchaseOrderItemComponent implements OnInit {

  partList = [3, 3, 3, 3, 3, 33, 3, 3, 3, 3, 3, 3, 3];
  showPaymentDetails = false;
  selectedPurchaseOrderId = null;
  constructor(
    public toast: ToastrService,
    public location: Location,
    public modalService: NgbModal,
    public route: Router
  ) {
    this.selectedPurchaseOrderId = this.route.url.split('/').pop();
  }

  ngOnInit() {
  }

  open(content, size: any = 'lg') {
    this.modalService
      .open(content, {
        size,
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      })
      .result.then(
        result => { },
        reason => { }
      );
  }

  togglePaymentInfo() {
    this.showPaymentDetails = !this.showPaymentDetails;
  }

  approvePurchase() {
    this.toast.success('Purchase ' + this.selectedPurchaseOrderId + ' Approved.');
    this.modalService.dismissAll();
    this.route.navigate(['../']);
    this.location.back();
  }

  rejectPurchase() {
    this.toast.success('Purchase ' + this.selectedPurchaseOrderId + ' Rejected.');
    this.modalService.dismissAll();
    this.location.back();
  }
}
