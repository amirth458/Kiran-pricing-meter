import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { GridOptions } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { CustomerData } from 'src/app/model/user.model';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { MetadataService } from 'src/app/service/metadata.service';
import { Part } from 'src/app/model/part.model';
import { PartQuote, Address } from '../../../../../model/part.model';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-price-view',
  templateUrl: './price-view.component.html',
  styleUrls: ['./price-view.component.css']
})
export class PriceViewComponent implements OnInit, OnChanges {
  @Input() part: Part;
  @Input() customer: CustomerData;
  @Input() partQuote: PartQuote;
  @Output() manualQuote: EventEmitter<any> = new EventEmitter();

  stage = 'unset';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [];
  gridOptions: GridOptions;
  rowData = [];
  invoiceItems;

  pricingForm: FormGroup = this.fb.group({
    toolingUnitCount: [1],
    toolingUnitPrice: [0],
    toolingLineItemCost: [0],
    partsUnitCount: [0],
    partsUnitPrice: [0],
    partsLineItemCost: [0],
    totalCost: [0]
  });

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public pricingService: RfqPricingService,
    public toastrService: ToastrService,
    private datePipe: DatePipe,
    public metadataService: MetadataService,
    public currencyPipe: CurrencyPipe
  ) {
    this.metadataService
      .getProcessMetaData('invoice_item')
      .subscribe(invoiceItems => {
        this.invoiceItems = invoiceItems;
      });
  }

  ngOnInit() {
    this.updateRowData();
    this.columnDefs = [
      {
        headerName: 'Customer',
        field: 'customer',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'RFQ',
        field: 'rfq',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center'
      },
      {
        headerName: 'Part',
        field: 'part',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center'
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'fileViewRenderer'
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center'
      },
      {
        headerName: 'Material',
        field: 'materialPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Process',
        field: 'equipmentPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      // {
      //   headerName: 'Roughness',
      //   field: 'roughness',
      //   hide: false,
      //   sortable: true,
      //   filter: false,
      //   cellClass: 'text-center'
      // },
      // {
      //   headerName: 'Post-Process',
      //   field: 'postProcess',
      //   hide: false,
      //   sortable: true,
      //   filter: true,
      //   cellClass: 'text-center'
      // },
      {
        headerName: 'Price',
        field: 'price',
        hide: false,
        sortable: true,
        cellClass: 'text-center'
      }
    ];
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  changeStage(newStage) {
    this.stage = newStage;
  }

  openModal(content, css) {
    this.modalService.open(content, {
      centered: true,
      windowClass: `${css}-modal`
    });
  }

  getShippingAddress(address: Address) {
    return Util.shippingAddressInfo(address);
  }

  onSave() {
    this.modalService.dismissAll();
    this.stage = 'set';

    this.pricingForm.setValue({
      ...this.pricingForm.value,
      toolingLineItemCost:
        this.pricingForm.value.toolingUnitCount *
        this.pricingForm.value.toolingUnitPrice,
      partsLineItemCost:
        this.pricingForm.value.partsUnitCount *
        this.pricingForm.value.partsUnitPrice,
      totalCost:
        this.pricingForm.value.toolingUnitCount *
          this.pricingForm.value.toolingUnitPrice +
        this.pricingForm.value.partsUnitCount *
          this.pricingForm.value.partsUnitPrice
    });

    const data = {
      expiredAt:
        this.datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss.SSS') + 'Z',
      id: 0,
      isExpired: null,
      isManualPricing: true,
      matchedProfileIds: [0],
      partId: this.part.id,
      partQuoteDetailList: [
        {
          extendedCost: 0,
          id: 0,
          invoiceCost: this.pricingForm.value.toolingLineItemCost,
          invoiceItemId: 4,
          invoiceLineItemId: 0,
          partQuoteId: 0,
          processPricingConditionTypeId: 0,
          unit: this.pricingForm.value.toolingUnitCount,
          unitPrice: this.pricingForm.value.toolingUnitPrice
        },
        {
          extendedCost: 0,
          id: 0,
          invoiceCost: this.pricingForm.value.partsLineItemCost,
          invoiceItemId: 3,
          invoiceLineItemId: 0,
          partQuoteId: 0,
          processPricingConditionTypeId: 0,
          unit: this.pricingForm.value.partsUnitCount,
          unitPrice: this.pricingForm.value.partsUnitPrice
        }
      ],
      totalCost: this.pricingForm.value.totalCost,
      winningProcessPricingId: 0
    };

    this.pricingService
      .createPartQuoteDetail(data)
      .pipe(catchError(e => this.handleError(e)))
      .subscribe(() => {
        this.toastrService.success('Part Quote created successfully.');
        this.manualQuote.emit();
      });
  }

  handleError(error: HttpErrorResponse) {
    const message = error.error.message;
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }

  onRecommendModalClose(ev) {
    this.modalService.dismissAll();
  }

  updateRowData() {
    if (this.part && this.customer) {
      this.pricingForm.setValue({
        ...this.pricingForm.value,
        partsUnitCount: this.part.quantity
      });
      this.rowData = [
        {
          id: this.part.id,
          subOrder: this.part.id,
          customer: this.customer.name,
          rfq: this.part.rfqMedia.projectRfqId,
          part: this.part.rfqMedia.projectRfqId + '.' + this.part.id,
          fileName: this.part.rfqMedia.media.name,
          quantity: this.part.quantity,
          materialPropertyValues: this.part.materialPropertyValues,
          equipmentPropertyValues: this.part.equipmentPropertyValues,
          roughness: '',
          postProcess: '',
          price: this.partQuote
            ? this.currencyPipe.transform(
                this.partQuote.totalCost,
                'USD',
                'symbol',
                '0.0-3'
              )
            : this.part.partStatusType.displayName
        }
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.part && changes.part.currentValue) {
      this.updateRowData();
    }
    if (changes.customer && changes.customer.currentValue) {
      this.updateRowData();
    }
    if (changes.partQuote && changes.partQuote.currentValue) {
      this.updateRowData();
    }
  }

  getInvoiceItem(id: number) {
    if (!this.invoiceItems) {
      return '';
    }
    const found = this.invoiceItems.find(item => item.id === id);
    return found ? found.name : '';
  }
}
