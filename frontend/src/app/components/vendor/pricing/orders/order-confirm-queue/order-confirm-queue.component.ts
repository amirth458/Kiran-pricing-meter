import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from 'ag-grid-community';

import { Observable } from 'rxjs';

import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { MetadataService } from '../../../../../service/metadata.service';
import { MetaData, MetadataConfig } from '../../../../../model/metadata.model';

@Component({
  selector: 'app-order-confirm-queue',
  templateUrl: './order-confirm-queue.component.html',
  styleUrls: ['./order-confirm-queue.component.css']
})
export class OrderConfirmQueueComponent implements OnInit {
  type = ['search', 'filter'];
  pageSize = 10;
  searchColumns = this.orderService.getGridSearchColumns();
  filterColumns = this.orderService.getGridFilterColumns();

  selectedIds = [];
  columnDefs: Array<any> = [];
  autoGroupColumnDef = null;
  gridOptions: GridOptions;
  rowData;
  vendorOrderID: number;
  bidOrderStatus = '';
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  status$: Observable<MetaData[]>;

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    public orderService: OrdersService,
    public metaDataService: MetadataService
  ) {}

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      pagination: true,
      paginationPageSize: this.pageSize,
      onRowClicked: event => this.router.navigateByUrl(`${this.router.url}/${event.data.bidOrder.id}`)
    };
    this.getStartedBidOrders();
    this.status$ = this.metaDataService.getAdminMetaData(MetadataConfig.BID_ORDER_STATUS_TYPE);
  }

  initColumns() {
    this.columnDefs = this.orderService.getOrderViewColumns();
    this.autoGroupColumnDef = {
      headerName: 'Vendor Order ID'
    };
  }

  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
  }

  getStartedBidOrders() {
    this.spinner.show();
    this.orderService.getStartedBidOrders().subscribe(v => {
      this.rowData = (v || []).length > 0 ? v : [];
      this.spinner.hide();
    });
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

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.setSortModel([
      {
        colId: 'bidOrder.id',
        sort: 'desc'
      }
    ]);
  }
}
