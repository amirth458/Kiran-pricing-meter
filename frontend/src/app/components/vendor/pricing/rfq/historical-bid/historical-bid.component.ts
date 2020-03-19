import { Component, OnInit, Input } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Part, PartQuote } from 'src/app/model/part.model';
import { CustomerData } from 'src/app/model/user.model';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { CurrencyPipe } from '@angular/common';

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
  rowData = [];

  type = ['search', 'filter'];

  searchColumns = [
    {
      name: 'Vendor Name',
      field: 'vendorName',
      tooltipField: 'vendorName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Pricing Profile',
      field: 'pricingProfile',
      tooltipField: 'pricingProfile',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Vendor Name',
      field: 'vendorName',
      tooltipField: 'vendorName',
      checked: true
    },
    {
      name: 'Pricing Profile',
      field: 'pricingProfile',
      tooltipField: 'pricingProfile',
      checked: true
    }
  ];

  constructor(public currencyPipe: CurrencyPipe) {}

  ngOnInit() {
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
        headerName: 'Vendor Name',
        field: 'vendorName',
        tooltipField: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Pricing Profile',
        field: 'pricingProfile',
        tooltipField: 'pricingProfile',
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
            : this.part.partStatusType.displayName
        }
      ];
    }
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
