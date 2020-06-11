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
  totalcounts;
  filterColumnsRequest = [];

  searchColumns = [
    {
      name: 'Customer Order ID',
      field: 'bidOrder.id',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Sub Order IDs',
      field: 'partIds',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Vendor Order ID',
      field: 'vendorOrderId',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Material',
      field: 'material',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Process',
      field: 'process',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Order ID',
      field: 'bidOrder.id',
      checked: true
    },
    {
      name: 'Sub Order IDs',
      field: 'partIds',
      checked: true
    },
    {
      name: 'Sub Order Count',
      field: 'subOrderCount',
      checked: true
    },
    {
      name: 'Vendor Order ID',
      field: 'vendorOrderId',
      checked: true
    },
    {
      name: 'Offer Price',
      field: 'offerPrice',
      checked: true
    },
    {
      name: 'Quantity',
      field: 'quantity',
      checked: true
    },
    {
      name: 'Material',
      field: 'material',
      checked: true
    },
    {
      name: 'Process',
      field: 'process',
      checked: true
    },
    {
      name: 'Delivery Date',
      field: 'deliveryDate',
      checked: true
    },
    {
      name: 'Status',
      field: 'bidOrder.bidOrderStatusType.description',
      checked: true
    }
  ];

  selectedIds = [];

  columnDefs: Array<any> = [];
  autoGroupColumnDef = null;
  gridOptions: GridOptions;
  rowData = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  pageType = 'production-orders';

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private orderService: OrdersService,
    public modal: NgbModal,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe,
    public route: ActivatedRoute
  ) {
    this.route.parent.params.subscribe(r => {
      if (r.projectType) {
        this.pageType = r.projectType;
        this.searchColumnsChange();
      }
    });
  }

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
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

  onSearch() {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler1');
        const ob = this.orderService.getConnectReleasedBiddingOrders(
          params.startRow / this.pageSize,
          this.pageSize,
          {
            q: '',
            filterColumnsRequests: this.filterColumnsRequest
          },
          this.pageType === 'production-orders'
            ? VendorOrderTypeEnum.DILIGENT_PRODUCTION
            : VendorOrderTypeEnum.DILIGENT_CONNECT
        );

        ob.subscribe(data => {
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
    this.searchColumns.map((column, index) => {
      if (column.checked && column.query.type) {
        this.filterColumnsRequest.push({
          id: index + 1,
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
