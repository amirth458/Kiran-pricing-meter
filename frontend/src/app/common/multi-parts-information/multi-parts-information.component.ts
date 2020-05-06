import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Input } from '@angular/core';

import { Part, RfqData, PartDimension } from 'src/app/model/part.model';
import { CustomerDetails } from 'src/app/model/customer.model';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-multi-parts-information',
  templateUrl: './multi-parts-information.component.html',
  styleUrls: ['./multi-parts-information.component.css']
})
export class MultiPartsInformationComponent implements OnInit {
  @Input() partIds: number[];

  currentId: number;
  part: Part;
  rfq: RfqData;
  customer: CustomerDetails;
  partDimension: PartDimension;

  constructor(
    public spinner: NgxSpinnerService,
    public pricingService: RfqPricingService,
    public customerService: CustomerService
  ) {}

  ngOnInit() {
    this.setTab(this.partIds[0]);
  }

  setTab(partId) {
    if (this.currentId !== partId) {
      this.currentId = partId;
      this.spinner.show('spooler');
      this.pricingService.getPartDetail(partId).subscribe(part => {
        this.spinner.hide('spooler');
        this.part = part;
        this.pricingService.getRfqDetail(this.part.rfqMedia.projectRfqId).subscribe(rfq => {
          this.rfq = rfq;
        });
        this.customerService.getCustomerDetailsById(this.part.rfqMedia.media.customerId).subscribe(customer => {
          this.customer = customer;
        });
        this.pricingService.getPartDimension(this.part.id).subscribe(dimension => {
          this.partDimension = dimension;
        });
      });
    }
  }
}
