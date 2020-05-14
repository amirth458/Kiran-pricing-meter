import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, Input } from '@angular/core';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';

import { ReportsService } from 'src/app/service/reports.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-insight-detail',
  templateUrl: './insight-detail.component.html',
  styleUrls: ['./insight-detail.component.css']
})
export class InsightDetailComponent implements OnInit {
  @Input() type;
  @Input() columnDefs;

  gridOptions: GridOptions;
  rowData = [];
  totalCount = 0;
  pageSize = 50;

  sortQuery = '';

  searchQuery = '';
  createdDateRange;
  lastAttemptDate;

  constructor(public spinner: NgxSpinnerService, public reportsService: ReportsService, public toastr: ToastrService) {}

  ngOnInit() {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 30,
      headerHeight: 30,
      paginationPageSize: this.pageSize,
      cacheBlockSize: this.pageSize,
      onSortChanged: params => {
        const sortModel = params.api.getSortModel();
        // const column = params.columnApi.getColumn(sortModel[0].colId);
        this.totalCount = 0;
        this.sortQuery = `${sortModel[0].colId},${sortModel[0].sort}`;
      }
    };
  }

  onGridReady(ev: GridReadyEvent) {
    this.gridOptions.api = ev.api;
    // this.gridOptions.api.sizeColumnsToFit();

    this.onSearch();
  }

  onSearch() {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler');
        const filter = {
          page: params.startRow / this.pageSize,
          size: this.pageSize,
          sort: this.sortQuery,
          filters: {
            beginDate: this.createdDateRange ? this.createdDateRange[0].toISOString().substr(0, 10) : null,
            endDate: this.createdDateRange ? this.createdDateRange[1].toISOString().substr(0, 10) : null,
            searchValue: this.searchQuery,
            lastAttemptDate: this.lastAttemptDate ? this.lastAttemptDate.toISOString().substr(0, 10) : undefined
          }
        };

        this.reportsService.getReports(this.type, filter).subscribe(data => {
          this.spinner.hide('spooler');
          this.refreshData(params, data);
        });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  onDownload() {
    const filter = {
      sort: '',
      filters: {
        beginDate: this.createdDateRange ? this.createdDateRange[0].toISOString().substr(0, 10) : null,
        endDate: this.createdDateRange ? this.createdDateRange[1].toISOString().substr(0, 10) : null,
        searchValue: this.searchQuery,
        lastAttemptDate: this.lastAttemptDate ? this.lastAttemptDate.toISOString().substr(0, 10) : undefined
      }
    };
    this.spinner.show();

    this.reportsService.download(this.type, filter, false).subscribe((data: any) => {
      this.spinner.hide();
      const downloadURL = window.URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }));
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `${this.type}-report.csv`;
      link.click();
    });
  }

  onUploadToZoho() {
    const filter = {
      sort: '',
      filters: {
        beginDate: this.createdDateRange ? this.createdDateRange[0].toISOString().substr(0, 10) : null,
        endDate: this.createdDateRange ? this.createdDateRange[1].toISOString().substr(0, 10) : null,
        searchValue: this.searchQuery,
        lastAttemptDate: this.lastAttemptDate ? this.lastAttemptDate.toISOString().substr(0, 10) : undefined
      }
    };

    this.spinner.show();
    this.reportsService.download(this.type, filter, true).subscribe(() => {
      this.spinner.hide();
      this.toastr.success('Request received. Please check in Zoho after 10 minutes.');
    });
  }

  refreshData(params, data) {
    this.totalCount += data.length;
    const lastRow = data.length < this.pageSize ? this.totalCount : -1;

    params.successCallback(data, lastRow);
  }

  onQueryChange(ev) {
    this.searchQuery = ev;
    this.onSearch();
  }

  onCreatedDateChange(ev) {
    this.createdDateRange = ev;
    this.onSearch();
  }

  onLastAttemptChange(ev) {
    this.lastAttemptDate = ev;
    this.onSearch();
  }

  onFilterColumnsChange(ev) {
    this.columnDefs = this.columnDefs.map(item => ({
      ...item,
      hide: (ev.find(v => v.name === item.headerName) || { hide: false }).hide
    }));
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setColumnDefs(this.columnDefs);
    }
  }
}
