import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { ColDef, GridOptions } from 'ag-grid-community';
import { RfqTypeEnum } from '../../../../../model/part.model';

@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.css']
})
export class RfqListComponent implements OnInit {
  columnDefs: ColDef[] = [];
  gridOptions: GridOptions;
  pageSize = 10;
  rfqType = RfqTypeEnum.AUTO_RFQ;
  placeholderText = 'Customer, RFQ, Part, Order';

  filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(public spinner: NgxSpinnerService, public router: Router) {}

  ngOnInit() {
    this.initColumns();
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
      cacheOverflowSize: 0
    };
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'RFQ ID',
        field: 'rfqId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqId'
      },
      {
        headerName: 'RFQ Profile',
        field: 'rfqProfile',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqProfile'
      },
      {
        headerName: 'Status',
        field: 'rfqStatus',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqStatus',
        valueFormatter: v => (v.value || '').replace(/_/g, ' ')
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
        headerName: 'Customer Contact Name',
        field: 'userName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'userName'
      },
      {
        headerName: 'RFQ Created',
        field: 'rfqCreatedAt',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqCreatedAt'
      },
      {
        headerName: 'Eligible Manufacturer Type',
        field: 'eligible_manufacturer_types',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'eligible_manufacturer_types'
      },
      {
        headerName: 'Eligible Regions',
        field: 'eligible_regions',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'eligible_regions'
      },
      {
        headerName: 'Facility Quality Certifications',
        field: 'facility_certificates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'facility_certificates'
      },
      {
        headerName: 'Part Certifications',
        field: 'part_certificates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'part_certificates'
      }
    ];
  }

  onGridReady(event) {}
}
