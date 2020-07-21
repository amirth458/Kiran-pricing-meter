import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from 'ag-grid-community';

import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { Util } from 'src/app/util/Util';
import { VendorOrderTypeEnum } from 'src/app/model/order.model';

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
  totalCounts;

  columnDefs: Array<any> = [];
  autoGroupColumnDef = null;
  gridOptions: GridOptions;
  rowData = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  pageType = 'prodex';

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private orderService: OrdersService,
    public modal: NgbModal,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe,
    public route: ActivatedRoute
  ) {
    if (this.router.url.startsWith('/prodex/connect')) {
      this.pageType = 'connect';
      this.onSearch();
    }
  }

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      paginationPageSize: this.pageSize,
      maxConcurrentDatasourceRequests: 1,
      rowModelType: 'infinite',
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      rowBuffer: 0,
      cacheBlockSize: this.pageSize,
      infiniteInitialRowCount: 0,
      cacheOverflowSize: 0,
      onRowClicked: event => {
        localStorage.setItem(
          'selectedProductionOrder',
          JSON.stringify({
            vendorOrderId: event.data.vendorOrderId,
            partIds: event.data.partIds,
            vendorId: event.data.vendorId
          })
        );
        this.router.navigateByUrl(`${this.router.url}/${event.data.customerOrderId}`);
      }
    };
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Customer Name',
        field: 'customerName',
        tooltip: params => params.value,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Customer Order ID',
        field: 'customerOrderId',
        tooltip: params => params.value,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Sub Order IDs',
        field: 'partIds',
        tooltip: params => (params.value || []).join(', '),
        sortable: true,
        filter: false,
        width: 240,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.partDetailCell
        }
      },
      {
        headerName: 'Vendor Order ID',
        field: 'vendorOrderId',
        tooltipFiled: 'vendorOrderId',
        sortable: true,
        filter: false,
        width: 240
      },
      {
        headerName: 'Vendor Order Status',
        field: 'vendorOrderStatus',
        tooltipFiled: 'vendorOrderStatus',
        sortable: true,
        filter: false,
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
  }

  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
  }

  onSearch(query?: string, beginDate?: Date, endDate?: Date) {
    if (!beginDate || !endDate) {
      const date = new Date();
      beginDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
      endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler1');
        const ob = this.orderService.getConnectReleasedBiddingOrders(
          params.startRow / this.pageSize,
          this.pageSize,
          {
            query,
            vendorOrderType: 4,
            beginDate,
            endDate
          },
          this.pageType === 'prodex' ? VendorOrderTypeEnum.DILIGENT_PRODUCTION : VendorOrderTypeEnum.DILIGENT_CONNECT
        );

        ob.subscribe(data => {
          this.spinner.hide('spooler1');
          const rowsThisPage = data.content;
          const lastRow = data.totalElements <= params.endRow ? data.totalElements : -1;
          this.totalCounts = data.totalElements;
          params.successCallback(rowsThisPage, lastRow);
        });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  onCreatedDateChange(ev) {
    if (ev.length && ev.length > 1) {
      this.onSearch(null, ev[0], ev[1]);
    } else {
      this.onSearch();
    }
  }

  onQueryChange(ev) {
    this.onSearch(ev);
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.onSearch();
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
