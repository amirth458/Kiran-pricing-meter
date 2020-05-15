import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShippingService } from 'src/app/service/shipping.service';
import { TrackingInfo } from 'src/app/model/shipping.model';

@Component({
  selector: 'app-tracking-details',
  templateUrl: './tracking-details.component.html',
  styleUrls: ['./tracking-details.component.css']
})
export class TrackingDetailsComponent implements OnInit {
  @Input() trackingNumber;
  @Input() carrier;

  trackingInfo: TrackingInfo = null;
  supportedCarriers = ['FEDEX', 'USPS', 'UPS', 'DHL_EXPRESS'];
  constructor(
    public modalService: NgbModal,
    public spinner: NgxSpinnerService,
    public toaster: ToastrService,
    public shippingService: ShippingService
  ) {}

  ngOnInit() {
    this.spinner.show('spooler');
  }

  get isCarrierSupported() {
    return this.supportedCarriers.includes(this.carrier);
  }

  unsupportedCarrier() {
    this.toaster.warning('This Carrier is not yet supported');
  }

  getTrackingInfo() {
    this.shippingService.getTrackingInfo(this.trackingNumber, this.carrier).subscribe(
      res => {
        this.trackingInfo = res;
        this.spinner.hide();
      },
      err => {
        this.toaster.error('Unable to fetch tracking details.');
        console.log(err);
        this.spinner.hide();
        this.modalService.dismissAll();
      }
    );
  }

  formatTrackingDetails(detail: string) {
    const split = detail.split(',');
    if (split.length <= 2) {
      return split;
    } else {
      const time = split[1];
      split[1] = split[2];
      split[2] = time;
      return split;
    }
  }
  open(content, size: any = 'lg') {
    this.getTrackingInfo();
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
}
