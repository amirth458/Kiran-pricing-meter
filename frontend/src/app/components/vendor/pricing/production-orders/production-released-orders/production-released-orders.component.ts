import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from 'ag-grid-community';

import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { Util } from 'src/app/util/Util';

@Component({
  selector: 'app-production-released-orders',
  templateUrl: './production-released-orders.component.html',
  styleUrls: ['./production-released-orders.component.css']
})
export class ProductionReleasedOrdersComponent implements OnInit {
  @ViewChild('partDetailCell') partDetailCell;
  @ViewChild('partDetailModal') partDetailModal;

  selectedOrderID;
  selectedParts;

  type = ['search', 'filter'];

  pageSize = 50;
  totalcounts;
  filterColumnsRequest = [];

  searchColumns = this.orderService.getGridSearchColumns();
  filterColumns = this.orderService.getGridFilterColumns();

  selectedIds = [];

  columnDefs: Array<any> = [];
  autoGroupColumnDef = null;
  gridOptions: GridOptions;
  rowData = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private orderService: OrdersService,
    public modal: NgbModal,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        if (event.data.bidOrder) {
          this.router.navigateByUrl(`${this.router.url}/${event.data.bidOrder.id}`);
        }
      }
    };
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Order ID',
        field: 'bidOrder.id',
        tooltip: params => params.value,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Sub Order IDs',
        field: 'partIds',
        tooltip: params => (params.value || []).join(', '),
        sortable: true,
        filter: false,
        valueFormatter: params => (params.value || []).join(', '),
        width: 240
      },
      {
        headerName: 'Sub Order Count',
        field: 'subOrderCount',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: '3D Vendor Order ID',
        field: 'vendorOrderId',
        sortable: true,
        filter: false
      },
      {
        headerName: 'Offer Price',
        field: 'offerPrice',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => {
          return this.currencyPipe.transform(dt.value || 0, 'USD', 'symbol', '0.0-3');
        }
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Material',
        field: 'materialPropertyValues',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Technology',
        field: 'equipmentPropertyValues',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Post-Process',
        field: 'postProcess',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Delivery Date',
        field: 'deliveryDate',
        tooltip: params => params.value,
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => {
          const arr = [];
          (dt.value || []).map(dt => {
            arr.push(this.datePipe.transform(dt, Util.dateFormat, 'UTC'));
          });
          return arr.length !== 0 ? arr.join(', ') : '';
        }
      }
    ];
    this.columnDefs.push({
      headerName: '',
      cellRenderer: 'templateRenderer',
      cellRendererParams: {
        ngTemplate: this.partDetailCell
      }
    });

    this.autoGroupColumnDef = {
      headerName: 'Vendor Order ID'
    };
  }
  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
  }

  onSearch() {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler1');
        this.orderService
          .getProductionReleasedBiddingOrders(params.startRow / this.pageSize, this.pageSize, {
            q: '',
            filterColumnsRequests: this.filterColumnsRequest
          })
          .subscribe(data => {
            this.spinner.hide('spooler1');
            const rowsThisPage = data.content;
            const lastRow = data.totalElements <= params.endRow ? data.totalElements : -1;
            this.totalcounts = data.totalElements;
            params.successCallback(rowsThisPage, lastRow);
            // this.reconfigColumns();
          });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
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

  searchColumnsChange() {
    this.filterColumnsRequest = [];
    this.searchColumns.map(column => {
      if (column.checked && column.query.type) {
        this.filterColumnsRequest.push({
          id: column.id,
          displayName: column.name,
          selectedOperator: column.query.type,
          searchedValue: column.query.filter
        });
      }
    });
    this.onSearch();
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.searchColumnsChange();
  }

  showPartDetails(ev, v) {
    ev.stopPropagation();
    this.selectedOrderID = v.bidOrder && v.bidOrder.id;
    this.selectedParts = v.partIds;

    this.modal.open(this.partDetailModal, {
      centered: true,
      size: 'lg',
      windowClass: 'part-detail'
    });
  }
}
