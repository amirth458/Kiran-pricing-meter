import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { CustomerDetails } from 'src/app/model/customer.model';
import { CustomerService } from 'src/app/service/customer.service';
import { MetadataService } from '../../../../service/metadata.service';
import { MetadataConfig } from '../../../../model/metadata.model';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { Part, RfqData, AppPartStatus, PartQuote, PartDimension } from 'src/app/model/part.model';
import { UserService } from 'src/app/service/user.service';
import { Util } from '../../../../util/Util';

@Component({
  selector: 'app-insight-part-information',
  templateUrl: './insight-part-information.component.html',
  styleUrls: ['./insight-part-information.component.css']
})
export class InsightPartInformationComponent implements OnInit {
  partList: Part[];
  @Input()
  set parts(value: Part[]) {
    this.partList = value;
    if ((value || []).length > 0) {
      const part = value[0];
      this.id$.next(part.id);
      this.getRfqData(part.rfqMedia.projectRfqId);
    }
  }
  get parts(): Part[] {
    return this.partList;
  }

  @Input() hideCloseButton: boolean;
  @Output() close: EventEmitter<any> = new EventEmitter();

  id$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  selected$: Observable<Part>;
  customer$: Observable<CustomerDetails>;
  dimension$: Observable<PartDimension>;
  quote$: Observable<PartQuote>;

  rfq: RfqData;
  invoiceItems;
  countries = [];
  certs = [];
  postProcesses = [];
  antiMatchCerts = [];
  operatorTypes = [];
  measurementUnits;

  constructor(
    protected pricingService: RfqPricingService,
    protected userService: UserService,
    protected customerService: CustomerService,
    protected spinner: NgxSpinnerService,
    public metadataService: MetadataService
  ) {}

  ngOnInit() {
    this.selected$ = this.id$.pipe(
      filter(value => value !== null),
      switchMap((value: number) => Observable.create((observer: any) => observer.next(this.getSelectedPart(value))))
    );
    this.dimension$ = this.id$.pipe(
      filter(value => value !== null),
      switchMap((value: number) => this.pricingService.getPartDimension(value))
    );
    this.customer$ = this.id$.pipe(
      filter(value => value !== null),
      map(value => this.getSelectedPart(value)),
      filter(value => value !== null),
      switchMap((value: Part) => this.customerService.getCustomerDetailsById(value.rfqMedia.media.customerId))
    );
    this.quote$ = this.id$.pipe(
      filter(value => value !== null),
      map(value => this.getSelectedPart(value)),
      filter(value => value !== null),
      tap(() => this.spinner.show('loadingQuote')),
      switchMap((value: Part) => {
        const isExpired = value.partStatusType.name === AppPartStatus.QUOTE_EXPIRED;
        return isExpired
          ? this.pricingService.getExpiredPartQuoteDetails(value.id)
          : this.pricingService.getPartQuote(value.id);
      }),
      tap(() => this.spinner.hide('loadingQuote'))
    );
    this.metadataService
      .getProcessMetaData('invoice_item')
      .subscribe(invoiceItems => (this.invoiceItems = invoiceItems));
    this.metadataService
      .getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE)
      .subscribe(v => (this.measurementUnits = v));
    this.metadataService.getMetaData('country').subscribe(v => (this.countries = v));
    this.metadataService.getMetaData('vendor_certificate').subscribe(v => (this.certs = v));
    this.metadataService.getAdminMetaData(MetadataConfig.POST_PROCESS_ACTION).subscribe(v => (this.postProcesses = v));
    this.metadataService.getMetaData('core_competence').subscribe(v => (this.antiMatchCerts = v));
    this.metadataService.getMetaData('operator_type').subscribe(v => (this.operatorTypes = v));
  }

  isProposalPart(part: Part): boolean {
    return Util.isProposalPart(part);
  }

  getSelectedPart(id: number) {
    const parts = this.parts.filter(part => part.id === id);
    return (parts.length > 0 ? parts[0] : null) as Part;
  }

  getRfqData(rfqId: number) {
    this.pricingService.getRfqDetail(rfqId).subscribe((rfq: RfqData) => (this.rfq = rfq));
  }

  beforeChange($event: NgbTabChangeEvent) {
    const id = Number($event.nextId);
    this.id$.next(id);
  }

  onClose() {
    this.close.emit();
  }
}
