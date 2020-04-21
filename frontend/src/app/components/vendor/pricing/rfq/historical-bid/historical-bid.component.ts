import { Component, OnInit, Input } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Part, PartQuote } from 'src/app/model/part.model';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { CurrencyPipe } from '@angular/common';
import { BiddingService } from 'src/app/service/bidding.service';
import { LegacyBidHistory } from 'src/app/model/billing.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerDetails } from 'src/app/model/customer.model';

@Component({
  selector: 'app-historical-bid',
  templateUrl: './historical-bid.component.html',
  styleUrls: ['./historical-bid.component.css']
})
export class HistoricalBidComponent implements OnInit {
  @Input() part: Part;
  @Input() customer: CustomerDetails;
  @Input() partQuote: PartQuote;

  partInfoGridOptions: GridOptions;
  measurementUnits = [];
  partInformation = [];
  partInfoColumnDefs = [];
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  columnDefs: ColDef[] = [];
  pageSize = 10;

  gridOptions: GridOptions;
  rowData: LegacyBidHistory[] = [];

  type = ['search', 'filter'];

  searchColumns = [
    {
      name: 'Vendor',
      field: 'vendor',
      tooltipField: 'vendor',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'RFQ Number',
      field: 'rfqNumber',
      tooltipField: 'rfqNumber',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Bid Number',
      field: 'bidNumber',
      tooltipField: 'bidNumber',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'File Name',
      field: 'fileName',
      tooltipField: 'fileName',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Proposed Finish',
      field: 'proposedFinish',
      tooltipField: 'proposedFinish',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Specs And Tolerance',
      field: 'specsAndTolerance',
      tooltipField: 'specsAndTolerance',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Implied Production And Delivery Window',
      field: 'impliedProductionAndDeliveryWindow',
      tooltipField: 'impliedProductionAndDeliveryWindow',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Target Delivery Date',
      field: 'target_delivery_date',
      tooltipField: 'target_delivery_date',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Part On Platform',
      field: 'partOnPlatform',
      tooltipField: 'partOnPlatform',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'X',
      field: 'x',
      tooltipField: 'x',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Y',
      field: 'y',
      tooltipField: 'y',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Z',
      field: 'z',
      tooltipField: 'z',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Volume',
      field: 'volume',
      tooltipField: 'volume',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Surface Area',
      field: 'surfaceArea',
      tooltipField: 'surfaceArea',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'TotalBid',
      field: 'vendorTotalBidAmount',
      tooltipField: 'vendorTotalBidAmount',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: '$/unit',
      field: 'unit',
      tooltipField: 'unit',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'L&M',
      field: 'vendorLaborAndMaterial',
      tooltipField: 'vendorLaborAndMaterial',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Shipping',
      field: 'shipping',
      tooltipField: 'shipping',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Taxes',
      field: 'taxes',
      tooltipField: 'taxes',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Vendor Yield',
      field: 'vendorYield',
      tooltipField: 'vendorYield',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Vendor',
      field: 'vendor',
      tooltipField: 'vendor',
      checked: true
    },
    {
      name: 'RFQ Number',
      field: 'rfqNumber',
      tooltipField: 'rfqNumber',
      checked: true
    },
    {
      name: 'Bid Number',
      field: 'bidNumber',
      tooltipField: 'bidNumber',
      checked: true
    },
    {
      name: 'File Name',
      field: 'fileName',
      tooltipField: 'fileName',
      checked: true
    },
    {
      name: 'Proposed Finish',
      field: 'proposedFinish',
      tooltipField: 'proposedFinish',
      checked: true
    },
    {
      name: 'Specs And Tolerance',
      field: 'specsAndTolerance',
      tooltipField: 'specsAndTolerance',
      checked: true
    },
    {
      name: 'Implied Production And Delivery Window',
      field: 'impliedProductionAndDeliveryWindow',
      tooltipField: 'impliedProductionAndDeliveryWindow',
      checked: true
    },
    {
      name: 'Target Delivery Date',
      field: 'target_delivery_date',
      tooltipField: 'target_delivery_date',
      checked: true
    },
    {
      name: 'Part On Platform',
      field: 'partOnPlatform',
      tooltipField: 'partOnPlatform',
      checked: true
    },
    {
      name: 'X',
      field: 'x',
      tooltipField: 'x',
      checked: true
    },
    {
      name: 'Y',
      field: 'y',
      tooltipField: 'y',
      checked: true
    },
    {
      name: 'Z',
      field: 'z',
      tooltipField: 'z',
      checked: true
    },
    {
      name: 'Volume',
      field: 'volume',
      tooltipField: 'volume',
      checked: true
    },
    {
      name: 'Surface Area',
      field: 'surfaceArea',
      tooltipField: 'surfaceArea',
      checked: true
    },
    {
      name: 'TotalBid',
      field: 'vendorTotalBidAmount',
      tooltipField: 'vendorTotalBidAmount',
      checked: true
    },
    {
      name: '$/unit',
      field: 'unit',
      tooltipField: 'unit',
      checked: true
    },
    {
      name: 'L&M',
      field: 'vendorLaborAndMaterial',
      tooltipField: 'vendorLaborAndMaterial',
      checked: true
    },
    {
      name: 'Shipping',
      field: 'shipping',
      tooltipField: 'shipping',
      checked: true
    },
    {
      name: 'Taxes',
      field: 'taxes',
      tooltipField: 'taxes',
      checked: true
    },
    {
      name: 'Vendor Yield',
      field: 'vendorYield',
      tooltipField: 'vendorYield',
      checked: true
    }
  ];

  constructor(
    public currencyPipe: CurrencyPipe,
    public biddingService: BiddingService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public orderService: OrdersService
  ) {}

  ngOnInit() {
    this.orderService.getAllMeasurementUnitType().subscribe(i => {
      this.measurementUnits = i.metadataList;
    });

    this.updateRowData();

    this.partInfoColumnDefs = [
      {
        headerName: 'Customer',
        field: 'customer',
        tooltipField: 'customer',
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
      {
        headerName: 'X',
        field: 'x',
        tooltipField: 'x',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => dt.data.partDimension.x.value + this.getUnitSymbol(dt.data.partDimension.x.unitId)
      },
      {
        headerName: 'Y',
        field: 'y',
        tooltipField: 'y',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => dt.data.partDimension.y.value + this.getUnitSymbol(dt.data.partDimension.y.unitId)
      },
      {
        headerName: 'Z',
        field: 'z',
        tooltipField: 'z',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => dt.data.partDimension.z.value + this.getUnitSymbol(dt.data.partDimension.z.unitId)
      },
      {
        headerName: 'Volume',
        field: 'volume',
        tooltipField: 'volume',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt =>
          dt.data.partDimension.volume.value + this.getUnitSymbol(dt.data.partDimension.volume.unitId)
      }
    ];
    this.partInfoGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.partInfoColumnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };

    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      pagination: true,
      paginationPageSize: this.pageSize,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  getUnitSymbol(unitId) {
    const result = this.measurementUnits.filter(item => item.id == unitId);
    if (result.length) {
      return ' ' + result[0].symbol;
    }
    return '';
  }

  configureColumnDefs() {
    this.filterColumns.map(column => {
      this.columnDefs.map(col => {
        if (col.headerName === column.name) {
          col.hide = !column.checked;
        }
      });
    });
  }

  filterColumnsChange(event) {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(columns) {
    columns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({ type: '', filter: '' });
        }
      }
      this.gridOptions.api.onFilterChanged();
    });
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Vendor',
        field: 'vendor',
        tooltipField: 'vendor',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'RFQ Number',
        field: 'rfqNumber',
        tooltipField: 'rfqNumber',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Bid Number',
        field: 'bidNumber',
        tooltipField: 'bidNumber',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        tooltipField: 'fileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Proposed Finish',
        field: 'proposedFinish',
        tooltipField: 'proposedFinish',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Specs And Tolerance',
        field: 'specsAndTolerance',
        tooltipField: 'specsAndTolerance',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Implied Production And Delivery Window',
        field: 'impliedProductionAndDeliveryWindow',
        tooltipField: 'impliedProductionAndDeliveryWindow',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Target Delivery Date',
        field: 'target_delivery_date',
        tooltipField: 'target_delivery_date',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Part On Platform',
        field: 'partOnPlatform',
        tooltipField: 'partOnPlatform',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'X',
        field: 'x',
        tooltipField: 'x',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => dt.value + ' (cm)'
      },
      {
        headerName: 'Y',
        field: 'y',
        tooltipField: 'y',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => dt.value + ' (cm)'
      },
      {
        headerName: 'Z',
        field: 'z',
        tooltipField: 'z',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => dt.value + ' (cm)'
      },
      {
        headerName: 'Volume',
        field: 'volume',
        tooltipField: 'volume',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Surface Area',
        field: 'surfaceArea',
        tooltipField: 'surfaceArea',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'TotalBid',
        field: 'vendorTotalBidAmount',
        tooltipField: 'vendorTotalBidAmount',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: value => {
          return '$' + value.data.vendorTotalBidAmount;
        }
      },
      {
        headerName: '$/unit',
        field: 'unit',
        tooltipField: 'unit',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: value => {
          console.log({ value });
          const data = value.data;
          const result = (data.vendorTotalBidAmount / data.partOnPlatform || '0').toString();
          return '$' + result;
        }
      },
      {
        headerName: 'L&M',
        field: 'vendorLaborAndMaterial',
        tooltipField: 'vendorLaborAndMaterial',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Shipping',
        field: 'shipping',
        tooltipField: 'shipping',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Taxes',
        field: 'taxes',
        tooltipField: 'taxes',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Yield',
        field: 'vendorYield',
        tooltipField: 'vendorYield',
        hide: false,
        sortable: true,
        filter: false
      }
    ];
  }

  updateRowData() {
    if (this.part && this.customer) {
      this.partInformation = [
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
            ? this.currencyPipe.transform(this.partQuote.totalCost, 'USD', 'symbol', '0.0-3')
            : this.part.partStatusType.displayName,
          partDimension: this.part.rfqMedia.media.partDimension
        }
      ];
    }
    this.spinner.show('spooler');
    this.biddingService.getBidHistory(this.part.id).subscribe((v: LegacyBidHistory[]) => {
      this.rowData = v;
      console.log({ v });
      this.spinner.hide('spooler');
    });
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }
}
