import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { MetadataService } from '../../../../../service/metadata.service';
import { PartQuote } from '../../../../../model/part.model';

@Component({
  selector: 'app-part-quote',
  templateUrl: './part-quote.component.html',
  styleUrls: ['./part-quote.component.css']
})
export class PartQuoteComponent implements OnInit, OnChanges {
  @Input() quote: PartQuote;
  @Input() allowedRequote = false;
  @Output() requote: EventEmitter<any> = new EventEmitter<any>();
  @Input() invoiceItems: any;

  onRequote() {
    this.requote.emit();
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

  getInvoiceItem(id: number) {
    if (this.invoiceItems) {
      const found = this.invoiceItems.find(item => item.id === id);
      return found ? found.name : '';
    }
    return '';
  }
}
