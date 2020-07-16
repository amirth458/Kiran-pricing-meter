import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';

import { CustomerDetails } from 'src/app/model/customer.model';
import { CustomerService } from 'src/app/service/customer.service';
import { MetadataService } from '../../../../service/metadata.service';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { Part, RfqData, AppPartStatus, PartQuote, PartDimension, AppPartTypeEnum } from 'src/app/model/part.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-insight-part-information',
  templateUrl: './insight-part-information.component.html',
  styleUrls: ['./insight-part-information.component.css']
})
export class InsightPartInformationComponent implements OnInit {
  @Input() parts: Part[];
  @Input() hideCloseButton: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();
  selectedPartId;

  part: Part;
  rfq: RfqData;
  customer: CustomerDetails;
  partQuote: PartQuote;
  partDimension: PartDimension;
  invoiceItems;
  appPartTypeEnum = AppPartTypeEnum;

  constructor(
    protected pricingService: RfqPricingService,
    protected userService: UserService,
    protected customerService: CustomerService,
    protected spinner: NgxSpinnerService,
    public metadataService: MetadataService
  ) {}

  ngOnInit() {
    this.metadataService
      .getProcessMetaData('invoice_item')
      .subscribe(invoiceItems => (this.invoiceItems = invoiceItems));
    if ((this.parts || []).length > 0) {
      this.selectPart(this.parts[0].id);
    }
  }

  selectPart(newId) {
    if (newId === this.selectedPartId) {
      return;
    }
    this.spinner.show();
    this.selectedPartId = newId;
    this.part = this.parts.filter(_ => _.id === this.selectedPartId)[0];

    this.pricingService.getRfqDetail(this.part.rfqMedia.projectRfq.id).subscribe(rfq => {
      this.rfq = rfq;
    });
    this.customerService.getCustomerDetailsById(this.part.rfqMedia.media.customerId).subscribe(customer => {
      this.customer = customer;
    });
    if (this.part.partStatusType.name === AppPartStatus.QUOTE_EXPIRED) {
      this.pricingService.getExpiredPartQuoteDetails(this.part.id).subscribe(partQuote => {
        this.partQuote = partQuote;
      });
    } else {
      this.pricingService.getPartQuote(this.part.id).subscribe(partQuote => {
        this.partQuote = partQuote;
      });
    }
    this.pricingService.getPartDimension(this.part.id).subscribe(dimension => {
      this.partDimension = dimension;
    });

    this.spinner.hide();
  }

  onClose() {
    this.close.emit();
  }
}
