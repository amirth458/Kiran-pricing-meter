import { Component, OnInit, Input } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Part, PartQuote } from 'src/app/model/part.model';
import { CustomerData } from 'src/app/model/user.model';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { CurrencyPipe } from '@angular/common';
import { BiddingService } from 'src/app/service/bidding.service';
import { BidHistory } from 'src/app/model/billing.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-historical-bid',
  templateUrl: './historical-bid.component.html',
  styleUrls: ['./historical-bid.component.css']
})
export class HistoricalBidComponent implements OnInit {
  @Input() part: Part;
  @Input() customer: CustomerData;
  @Input() partQuote: PartQuote;

  partInfoGridOptions: GridOptions;
  partInformation = [];
  partInfoColumnDefs = [];
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  columnDefs = [];
  gridOptions: GridOptions;
  rowData: BidHistory[] = [];

  type = ['search', 'filter'];

  searchColumns = [
    {
      name: 'RFQ',
      field: 'rfqName',
      tooltipField: 'rfqName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Bid',
      field: 'bidNumber',
      tooltipField: 'bidNumber',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Files',
      field: 'fileName',
      tooltipField: 'fileName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Finish',
      field: 'proposedFinish',
      tooltipField: 'proposedFinish',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Delivery',
      field: 'impliedProductionAndDeliveryWindow',
      tooltipField: 'impliedProductionAndDeliveryWindow',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Units',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'X',
      field: 'xmm',
      tooltipField: 'xmm',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Y',
      field: 'ymm',
      tooltipField: 'ymm',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Z',
      field: 'zmm',
      tooltipField: 'zmm',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Vol',
      field: 'volumeMm3',
      tooltipField: 'volumeMm3',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'SA',
      field: 'areaMm2',
      tooltipField: 'areaMm2',
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
      name: 'VendorShare',
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
      name: 'RFQ',
      field: 'rfqName',
      tooltipField: 'rfqName',
      checked: true
    },
    {
      name: 'Bid',
      field: 'bidNumber',
      tooltipField: 'bidNumber',
      checked: true
    },
    {
      name: 'Files',
      field: 'fileName',
      tooltipField: 'fileName',
      checked: true
    },
    {
      name: 'Finish',
      field: 'proposedFinish',
      tooltipField: 'proposedFinish',
      checked: true
    },
    {
      name: 'Delivery',
      field: 'impliedProductionAndDeliveryWindow',
      tooltipField: 'impliedProductionAndDeliveryWindow',
      checked: true
    },
    {
      name: 'Units',
      checked: true
    },
    {
      name: 'X',
      field: 'xmm',
      tooltipField: 'xmm',
      checked: true
    },
    {
      name: 'Y',
      field: 'ymm',
      tooltipField: 'ymm',
      checked: true
    },
    {
      name: 'Z',
      field: 'zmm',
      tooltipField: 'zmm',
      checked: true
    },
    {
      name: 'Vol',
      field: 'volumeMm3',
      tooltipField: 'volumeMm3',
      checked: true
    },
    {
      name: 'SA',
      field: 'areaMm2',
      tooltipField: 'areaMm2',
      checked: true
    },
    {
      name: 'TotalBid',
      field: 'vendorTotalBidAmount',
      tooltipField: 'vendorTotalBidAmount',
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
      name: 'VendorShare',
      field: 'vendorYield',
      tooltipField: 'vendorYield',
      checked: true
    }
  ];

  constructor(
    public currencyPipe: CurrencyPipe,
    public biddingService: BiddingService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.partInfoColumnDefs = [
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
        headerName: 'RFQ',
        field: 'rfq',
        tooltipField: 'rfq',
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
        headerName: 'Price',
        field: 'price',
        tooltipField: 'price',
        hide: false,
        sortable: true,
        cellClass: 'text-center'
      }
    ];
    this.partInfoGridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.partInfoColumnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
    this.updateRowData();

    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
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
        headerName: 'RFQ',
        field: 'rfqName',
        tooltipField: 'rfqName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Bid',
        field: 'bidNumber',
        tooltipField: 'bidNumber',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Files',
        field: 'fileName',
        tooltipField: 'fileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Finish',
        field: 'proposedFinish',
        tooltipField: 'proposedFinish',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Delivery',
        field: 'impliedProductionAndDeliveryWindow',
        tooltipField: 'impliedProductionAndDeliveryWindow',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Units',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: () => 'mm'
      },
      {
        headerName: 'X',
        field: 'xmm',
        tooltipField: 'xmm',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Y',
        field: 'ymm',
        tooltipField: 'ymm',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Z',
        field: 'zmm',
        tooltipField: 'zmm',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vol',
        field: 'volumeMm3',
        tooltipField: 'volumeMm3',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'SA',
        field: 'areaMm2',
        tooltipField: 'areaMm2',
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
        filter: false
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
        headerName: 'VendorShare',
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
          fileName: this.part.rfqMedia.media.name,
          rfq: this.part.rfqMedia.projectRfqId,
          materialPropertyValues: this.part.materialPropertyValues,
          equipmentPropertyValues: this.part.equipmentPropertyValues,
          price: this.partQuote
            ? this.currencyPipe.transform(this.partQuote.totalCost, 'USD', 'symbol', '0.0-3')
            : this.part.partStatusType.displayName
        }
      ];
    }
    this.spinner.show('spooler');
    this.biddingService.getBidHistory().subscribe((v: BidHistory[]) => {
      this.rowData = v;
      this.spinner.hide('spooler');
    });
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
