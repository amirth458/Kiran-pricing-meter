import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { GridOptions } from 'ag-grid-community';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { empty, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Chat, ChatTypeEnum } from '../../../../../model/chat.model';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { MetadataService } from 'src/app/service/metadata.service';
import { Part, PartQuoteInvoiceItem } from 'src/app/model/part.model';
import { PartQuote, Address } from '../../../../../model/part.model';
import { PartNoteService } from '../../../../../service/part-note.service';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { Util } from '../../../../../util/Util';
import { UserService } from '../../../../../service/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerDetails } from 'src/app/model/customer.model';

@Component({
  selector: 'app-price-view',
  templateUrl: './price-view.component.html',
  styleUrls: ['./price-view.component.css']
})
export class PriceViewComponent implements OnInit, OnChanges {
  @ViewChild('scroller') private scroller: ElementRef;
  @ViewChild('refreshWindow') private refreshWindow: ElementRef<any>;
  partQuoteValue: PartQuote;
  @Input() part: Part;
  @Input() customer: CustomerDetails;
  @Output() manualQuote: EventEmitter<any> = new EventEmitter();
  @Input()
  set partQuote(value: PartQuote) {
    this.partQuoteValue = value || null;
  }
  get partQuote(): PartQuote {
    return this.partQuoteValue;
  }

  stage = 'unset';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [];
  gridOptions: GridOptions;
  rowData = [];
  invoiceItems;

  pricingForm: FormGroup = this.fb.group({
    toolingUnitCount: [0],
    toolingUnitPrice: [0],
    toolingLineItemCost: [0],
    partsUnitCount: [0],
    partsUnitPrice: [0],
    partsLineItemCost: [0],
    totalCost: [0],
    noBid: [false]
  });

  dynamicForm: FormGroup = this.fb.group({
    prices: new FormArray([])
  });

  chatType = ChatTypeEnum;
  chat: Chat;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public pricingService: RfqPricingService,
    public toaster: ToastrService,
    private datePipe: DatePipe,
    public metadataService: MetadataService,
    public currencyPipe: CurrencyPipe,
    public partNoteService: PartNoteService,
    public userService: UserService,
    public spinner: NgxSpinnerService
  ) {
    this.metadataService
      .getProcessMetaData('invoice_item')
      .subscribe(invoiceItems => (this.invoiceItems = invoiceItems));
  }

  ngOnInit() {
    this.updateRowData();
    this.columnDefs = [
      {
        headerName: 'Customer Id',
        field: 'customerId',
        tooltipField: 'customerId',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Customer',
        field: 'customer',
        tooltipField: 'customer',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Email',
        field: 'email',
        tooltipField: 'email',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'RFQ',
        field: 'rfq',
        tooltipField: 'rfq',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center'
      },
      {
        headerName: 'Part',
        field: 'part',
        tooltipField: 'part',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center'
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        tooltipField: 'fileName',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'fileViewRenderer'
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        tooltipField: 'quantity',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center'
      },
      {
        headerName: 'Material',
        field: 'materialPropertyValues',
        tooltipField: 'materialPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Technology',
        field: 'equipmentPropertyValues',
        tooltipField: 'equipmentPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      // {
      //   headerName: 'Roughness',
      //   field: 'roughness',
      //   tooltipField: 'roughness',
      //   hide: false,
      //   sortable: true,
      //   filter: false,
      //   cellClass: 'text-center'
      // },
      // {
      //   headerName: 'Post-Process',
      //   field: 'postProcess',
      //   tooltipField: 'postProcess',
      //   hide: false,
      //   sortable: true,
      //   filter: true,
      //   cellClass: 'text-center'
      // },
      {
        headerName: 'Price',
        field: 'price',
        tooltipField: 'price',
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

  get controls() {
    return this.dynamicForm.controls;
  }
  get prices() {
    return this.controls.prices as FormArray;
  }

  startOverrideForm() {
    (this.partQuote.partQuoteInvoiceItemDetails || []).forEach((quote: PartQuoteInvoiceItem) => {
      this.prices.push(
        this.fb.group({
          partQuoteId: [this.filterPartQuoteId() || '', Validators.required],
          invoiceItemId: [quote.invoiceItemId || '', Validators.required],
          value: [quote.value || 0, Validators.required],
          unit: [quote.unit || 0, Validators.required],
          unitPrice: [quote.unitPrice || 0, Validators.required]
        })
      );
    });
    this.changeStage('edit');
  }

  filterPartQuoteId(): number {
    let partQuoteId = null;
    (this.partQuote.partQuoteInvoiceItemDetails || []).forEach(v => {
      if (v.partQuoteInvoiceLineItemDetails.length > 0) {
        partQuoteId = v.partQuoteInvoiceLineItemDetails[0].partQuoteId;
      }
    });
    return partQuoteId;
  }

  calcLineItemCost(form: any) {
    const v: any = form.getRawValue();
    return (v.unit || 0) * (v.unitPrice || 0);
  }

  findLineItemTotalCost() {
    let totalCost = 0;
    (this.prices.getRawValue() || []).map(f => {
      totalCost += (f.unit || 0) * (f.unitPrice || 0);
    });
    return totalCost;
  }

  resetDynamicForm() {
    this.dynamicForm = this.fb.group({
      prices: new FormArray([])
    });
    this.dynamicForm.reset();
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
    let defConfig = {};
    if (this.part.manualPricingAllowed) {
      this.pricingForm.setValue({
        ...this.pricingForm.value,
        toolingLineItemCost: this.pricingForm.value.toolingUnitCount * this.pricingForm.value.toolingUnitPrice,
        partsLineItemCost: this.pricingForm.value.partsUnitCount * this.pricingForm.value.partsUnitPrice,
        totalCost:
          this.pricingForm.value.toolingUnitCount * this.pricingForm.value.toolingUnitPrice +
          this.pricingForm.value.partsUnitCount * this.pricingForm.value.partsUnitPrice
      });
      defConfig = {
        id: null,
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
        totalCost: this.pricingForm.value.totalCost
      };
    } else {
      defConfig = {
        id: this.partQuote.id,
        partQuoteDetailList: (this.prices.getRawValue() || []).map(f => {
          return {
            extendedCost: 0,
            id: 0,
            invoiceCost: (f.unit || 0) * (f.unitPrice || 0),
            invoiceItemId: f.invoiceItemId,
            invoiceLineItemId: 0,
            partQuoteId: f.partQuoteId,
            processPricingConditionTypeId: 0,
            unit: f.unit,
            unitPrice: f.unitPrice
          };
        }),
        totalCost: this.findLineItemTotalCost()
      };
    }

    const data = {
      ...defConfig,
      ...{
        isManualPricing: true,
        expiredAt: this.datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss.SSS') + 'Z',
        isExpired: null,
        matchedProfileIds: [0],
        partId: this.part.id,
        winningProcessPricingId: 0
      }
    };
    this.pricingService
      .createPartQuoteDetail(data)
      .pipe(
        catchError(e => {
          this.handleError(e);
          return empty();
        })
      )
      .subscribe(() => {
        this.toaster.success('Part Quote created successfully.');
        this.manualQuote.emit();
        this.changeStage('unset');
      });
  }

  refresh() {
    this.changeStage('unset');
    this.modalService.dismissAll();
    this.resetDynamicForm();
    this.manualQuote.emit();
  }

  handleError(error: HttpErrorResponse) {
    const message = error.error.message;
    if (message.indexOf('Please refresh and try again') > 0) {
      this.openModal(this.refreshWindow, 'refresh');
    } else {
      this.toaster.error(`${message} Please contact your admin`);
      return throwError('Error');
    }
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
          customerId: this.customer.id,
          customer: this.customer.name,
          email: this.customer.user.email,
          rfq: this.part.rfqMedia.projectRfqId,
          part: this.part.rfqMedia.projectRfqId + '.' + this.part.id,
          fileName: this.part.rfqMedia.media.name,
          quantity: this.part.quantity,
          materialPropertyValues: this.part.materialPropertyValues,
          equipmentPropertyValues: this.part.equipmentPropertyValues,
          roughness: '',
          postProcess: '',
          price: this.partQuote
            ? this.currencyPipe.transform(this.partQuote.totalCost, 'USD', 'symbol', '0.0-3')
            : this.part.partStatusType.displayName
        }
      ];
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes.part && changes.part.currentValue) ||
      (changes.customer && changes.customer.currentValue) ||
      (changes.partQuote && changes.partQuote.currentValue)
    ) {
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

  noBidConfirm() {
    this.spinner.show();
    this.pricingService.setNoBid(this.part.id.toString()).subscribe(
      res => {
        this.modalService.dismissAll();
        this.spinner.hide();
        this.toaster.success('Part set to No Bid successfully.');
        this.changeStage('unset');
        this.part.isNoBid = true;
      },
      () => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toaster.error('Error while setting part to No Bid.');
      }
    );
  }
}
