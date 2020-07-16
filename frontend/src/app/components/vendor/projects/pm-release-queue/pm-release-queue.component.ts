import { Component, OnInit } from '@angular/core';

import { ColDef, GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pm-release-queue',
  templateUrl: './pm-release-queue.component.html',
  styleUrls: ['./pm-release-queue.component.css']
})
export class PmReleaseQueueComponent implements OnInit {
  gridOptions: GridOptions;
  columnDefs: ColDef[] = [];
  pageSize = 10;

  placeholderText = 'Customer, RFQ, Part, Order';
  totalRows: number;

  filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor() {}

  ngOnInit() {
    this.initColumnDef();
    this.gridOptions = {
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
      onRowClicked: event => {}
    };
  }

  initColumnDef() {
    this.columnDefs = [
      {
        headerName: 'Bid Id',
        field: 'bidPmProjectId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'bidPmProjectId'
      },
      {
        headerName: 'Customer Name',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'customerName'
      },
      {
        headerName: 'User Name',
        field: 'userName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'userName'
      },
      {
        headerName: 'Order ID',
        field: 'orderIds',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'orderIds'
      },
      {
        headerName: 'RFQ ID',
        field: 'rfqIds',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqIds'
      },
      {
        headerName: 'Part/Suborder ID',
        field: 'partIds',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'partIds'
      },
      {
        headerName: 'Status',
        field: 'bidPmProjectStatus',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'bidPmProjectStatus'
      }
    ];
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
