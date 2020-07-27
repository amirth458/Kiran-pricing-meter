import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { MetadataService } from '../../../../service/metadata.service';
import { PartQuoteCustomerView } from '../../../../model/connect.model';

@Component({
  selector: 'app-customer-part-quote',
  templateUrl: './customer-part-quote.component.html',
  styleUrls: ['./customer-part-quote.component.css']
})
export class CustomerPartQuoteComponent implements OnInit, OnChanges {
  @Input() quote: PartQuoteCustomerView;
  @Input() allowedRequote = false;
  @Output() requote: EventEmitter<any> = new EventEmitter<any>();
  @Input() invoiceItems: any;
  @Input()
  editable: boolean;

  @Output()
  quoteChange: EventEmitter<PartQuoteCustomerView> = new EventEmitter<PartQuoteCustomerView>();

  get totalCost(): number {
    return this.quote ? Number(this.quote.totalCost || 0) + Number(this.quote.marginCost || 0) : 0;
  }

  constructor(public metadataService: MetadataService) {}

  ngOnInit() {
    if (!this.invoiceItems) {
      this.metadataService.getProcessMetaData('invoice_item').subscribe(v => (this.invoiceItems = v));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.quotes && changes.quotes.currentValue) {
      this.quote = changes.quotes.currentValue;
    }
  }

  onRequote() {
    this.requote.emit();
  }

  onMarginCostChange() {
    this.quoteChange.emit(this.quote);
  }

  getInvoiceItem(id: number) {
    if (this.invoiceItems) {
      const found = this.invoiceItems.find(item => item.id === id);
      return found ? found.name : '';
    }
    return '';
  }
}
