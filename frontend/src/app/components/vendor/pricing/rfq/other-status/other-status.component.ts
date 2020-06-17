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
  pageSize = 20;

  totalCount = 0;
  totalRows = 0;
  destroy$ = new Subject();

  filterOptions = {};

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
    public partService: PartService
  ) {}

  ngOnInit() {
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
        cellClass: 'text-center',
        tooltipField: 'rfqId'
      },
      {
        headerName: 'Part',
        field: 'partId',
        hide: false,
        sortable: true,
        filter: false,
        cellClass: 'text-center',
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
        cellClass: 'text-center',
        tooltipField: 'price',
        valueFormatter: dt => {
          return this.currencyPipe.transform(dt.value || 0, 'USD', 'symbol', '0.0-3');
        }
      }
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
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

  onSearch() {
    this.totalCount = 0;
    this.totalRows = 0;
    const dataSource = {
      rowCount: 0,
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

            this.totalCount += data.length;
            if (data.length > 0) {
              this.totalRows = data[0]['totalRowCount'];
            }
            const lastRow = data.length < this.pageSize ? this.totalCount : -1;
            params.successCallback(rowsThisPage, lastRow);

            // this.reconfigColumns();
          });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  onChangeFilterOptions(ev) {
    this.filterOptions = {
      ...ev,
      partTypeId: 2,
      manualPricingAllowed: null
    };
    this.onSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
