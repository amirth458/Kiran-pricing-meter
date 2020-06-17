import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';

import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { CustomerService } from 'src/app/service/customer.service';
import { PartService } from 'src/app/service/part.service';
import { ProjectService } from 'src/app/service/project.service';
import { AppPartTypeId } from 'src/app/model/part.model';
import { ProjectTypeEnum } from 'src/app/model/order.model';

@Component({
  selector: 'app-other-status',
  templateUrl: './other-status.component.html',
  styleUrls: ['./other-status.component.css']
})
export class OtherStatusComponent implements OnInit, OnDestroy {
  columnDefs = [];
  gridOptions: GridOptions;
  rowData: any[] = [];
  navigation;
  pageSize = 10;

  totalCount = 0;
  totalRows = 0;
  destroy$ = new Subject();

  partType = AppPartTypeId.RFQ_PART;
  projectType = ProjectTypeEnum.RFQ_PROJECT;
  filterOptions = {
    partStatusTypeId: null,
    rfqId: null,
    partId: null,
    customerName: null,
    partTypeId: null,
    manualPricingAllowed: null,
    projectTypeId: null,
    searchValue: null,
    beginDate: null,
    endDate: null
  };
  partStatusList = [
    { id: 1, name: 'READY FOR QUOTING' },
    { id: 2, name: 'AUTO QUOTED' },
    { id: 5, name: 'AWAITING QUOTE' },
    { id: 3, name: 'MANUAL QUOTE' },
    { id: 4, name: 'QUOTE EXPIRED' },
    { id: 14, name: 'NO QUOTE' },
    { id: 13, name: 'PAYMENT PENDING' },
    { id: 6, name: 'PLACING ORDER' },
    { id: 7, name: 'PRE PRODUCTION' },
    { id: 8, name: 'PRODUCTION' },
    { id: 9, name: 'POST PRODUCTION' },
    { id: 10, name: 'SHIPPED' },
    { id: 11, name: 'DELIVERED' },
    { id: 12, name: 'PART COMPLETE' }
  ];
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(
    public spinner: NgxSpinnerService,
    public pricingService: RfqPricingService,
    public router: Router,
    public customerService: CustomerService,
    public currencyPipe: CurrencyPipe,
    public toast: ToastrService,
    public partService: PartService,
    public projectService: ProjectService
  ) {}

  ngOnInit() {
    if (this.router.url.startsWith('/prodex/projects')) {
      this.partType = AppPartTypeId.PRODUCTION_PART;
      this.projectType = ProjectTypeEnum.PRODUCTION_PROJECT;
      this.partStatusList = [
        { id: 1, name: 'READY FOR QUOTING' },
        { id: 16, name: 'MATCHED SUPPLIER' },
        { id: 17, name: 'NO MATCHED SUPPLIER' },
        { id: 13, name: 'PAYMENT PENDING' },
        { id: 18, name: 'PART AWAITING RELEASE' },
        { id: 15, name: 'PART AWAITING VENDORS' },
        { id: 19, name: 'VENDOR CONFIRMED' },
        { id: 20, name: 'QUOTE ACCEPTED' },
        { id: 21, name: 'VENDOR MANUAL QUOTED' }
      ];
    } else if (this.router.url.startsWith('/prodex/connect')) {
      this.partType = AppPartTypeId.CONNECT_PART;
      this.projectType = ProjectTypeEnum.CONNECT_PROJECT;
      this.partStatusList = [
        { id: 1, name: 'READY FOR QUOTING' },
        { id: 16, name: 'MATCHED SUPPLIER' },
        { id: 17, name: 'NO MATCHED SUPPLIER' },
        { id: 13, name: 'PAYMENT PENDING' },
        { id: 18, name: 'PART AWAITING RELEASE' },
        { id: 15, name: 'PART AWAITING VENDORS' },
        { id: 19, name: 'VENDOR CONFIRMED' },
        { id: 20, name: 'QUOTE ACCEPTED' },
        { id: 21, name: 'VENDOR MANUAL QUOTED' }
      ];
    }
    this.filterOptions.partTypeId = this.partType;
    this.filterOptions.projectTypeId = this.projectType;
    this.columnDefs = [
      {
        headerName: 'CustomerName',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'customerName'
      },
      {
        headerName: 'RFQ',
        field: 'rfqId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqId'
      },
      {
        headerName: 'Part',
        field: 'partId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'partId'
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'fileViewRenderer',
        tooltipField: 'fileName'
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center',
        tooltipField: 'quantity'
      },
      {
        headerName: 'Material',
        field: 'material',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(', '),
        tooltipField: 'materialPropertyValues'
      },
      {
        headerName: 'Technology',
        field: 'technology',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(', '),
        tooltipField: 'equipmentPropertyValues'
      },
      {
        headerName: 'Price',
        field: 'price',
        hide: false,
        sortable: true,
        tooltipField: 'price',
        valueFormatter: dt => {
          return this.currencyPipe.transform(dt.value || 0, 'USD', 'symbol', '0.0-3');
        }
      }
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      paginationPageSize: this.pageSize,
      enableColResize: true,
      maxConcurrentDatasourceRequests: 1,
      rowHeight: 35,
      headerHeight: 35,
      rowModelType: 'infinite',

      rowBuffer: 0,
      cacheBlockSize: this.pageSize,
      infiniteInitialRowCount: 0,
      cacheOverflowSize: 0,
      onRowClicked: event => {
        this.router.navigateByUrl(`${this.router.url}/${event.data.partId}`);
      }
    };
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.onSearch();
  }

  onQueryChange(ev) {
    this.filterOptions.searchValue = ev;
    this.onSearch();
  }

  onCreatedDateChange(ev) {
    if (ev.length) {
      this.filterOptions.beginDate = ev[0];
      this.filterOptions.endDate = ev[1];
    }
    this.onSearch();
  }

  onSearch() {
    this.totalCount = 0;
    this.totalRows = 0;
    const dataSource = {
      getRows: params => {
        this.spinner.show('spooler');
        this.pricingService
          .getPartsByFilter(this.filterOptions, {
            page: params.startRow / this.pageSize,
            size: this.pageSize
          })
          .pipe(
            takeUntil(this.destroy$),
            catchError((err: any) => {
              const obj = JSON.parse(err.error && err.error.message ? err.error.message || '{}' : '{}');
              this.toast.error(`Unable to get Data: ${obj.message || ''}`);
              this.spinner.hide('spooler');
              return empty();
            })
          )
          .subscribe(data => {
            this.spinner.hide('spooler');
            const rowsThisPage = data || [];

            this.totalCount += rowsThisPage.length;
            if (rowsThisPage.length > 0) {
              this.totalRows = rowsThisPage[0]['totalRowCount'];
            }
            const lastRow = rowsThisPage.length < this.pageSize ? this.totalCount : -1;
            if (rowsThisPage.length) {
              params.successCallback(rowsThisPage, lastRow);
            }

            // this.reconfigColumns();
          });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  onChangeFilterOptions(ev) {
    if (!ev.target) {
      this.filterOptions = {
        ...this.filterOptions,
        ...ev
      };
      this.onSearch();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
