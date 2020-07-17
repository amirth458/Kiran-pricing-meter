import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { FilterOption } from 'src/app/model/vendor.model';
import { ProjectService } from 'src/app/service/project.service';
import { SearchOpt } from './pm-suborder-release-queue.model';
import { ProjectTypeEnum } from 'src/app/model/order.model';
import { AppPartStatusId } from 'src/app/model/part.model';
import { Util } from 'src/app/util/Util';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';

@Component({
  selector: 'app-pm-suborder-release-queue',
  templateUrl: './pm-suborder-release-queue.component.html',
  styleUrls: ['./pm-suborder-release-queue.component.css']
})
export class PmSuborderReleaseQueueComponent implements OnInit {
  columnDefs: ColDef[] = [];
  connectColumnDefs: ColDef[] = [];
  testAccount = false;
  @ViewChild('selectButton') selectButton: TemplateRef<any>;
  gridOptions: GridOptions;
  navigation;

  pageSize = 10;
  type = '';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  requestBody = {
    projectTypeId: null,
    partStatusIds: null,
    searchValue: null,
    beginDate: null,
    endDate: null,
    includeRelatedPartIds: false
  };
  searchOpt: SearchOpt = new SearchOpt();
  totalRows = 0;
  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public projectService: ProjectService,
    public datePipe: DatePipe
  ) {
    this.type = router.url.split('/')[3];
  }

  ngOnInit() {
    this.initColumnDef();
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
        const url =
          this.type === 'pm-suborder-relase-queue' || this.type === 'order-complete'
            ? `${this.router.url}/${event.data.orderId}`
            : `${this.router.url}/${event.data.partId}`;
        this.router.navigateByUrl(url);
      }
    };
  }

  isProdProject() {
    return (
      this.type === 'pm-suborder-relase-queue' ||
      this.type === 'vendor-confirmation-queue' ||
      this.type === 'released-projects'
    );
  }

  /* Row select */
  onRowSelect($event) {
    console.log($event);
  }

  onQueryChange(ev) {
    this.requestBody.searchValue = ev;
    console.log(ev, this.requestBody.searchValue);
    this.setDataSource();
  }

  onCreatedDateChange(ev) {
    if (!ev || !ev.length) {
      return;
    }
    this.requestBody.beginDate = ev[0];
    this.requestBody.endDate = ev[1];
    this.setDataSource();
  }

  getSorting() {
    let defaultSorting = 'id,desc';
    return defaultSorting;
  }

  onClickAdvancedToVendor() {
    //Todo
    console.log('onClickAdvancedToVendor');
  }

  toggleRelatedPart() {
    this.requestBody.includeRelatedPartIds = !this.requestBody.includeRelatedPartIds;
    this.initColumnDef();
    this.gridOptions.api.setColumnDefs(this.connectColumnDefs);
    this.gridOptions.api.sizeColumnsToFit();
    this.setDataSource();
  }

  setDataSource() {
    const dataSource = {
      rowCount: null,
      getRows: params => {
        this.spinner.show('loadingPanel');
        const filterOption: FilterOption = {
          page: params.startRow / this.pageSize,
          size: this.pageSize,
          sort: this.getSorting()
        };
        let ob: Observable<any> = null;

        if (this.type === 'pm-suborder-relase-queue') {
          (this.searchOpt.beginDate = this.requestBody.beginDate),
            (this.searchOpt.endDate = this.requestBody.endDate),
            (this.searchOpt.partStatusIds = AppPartStatusId.PART_AWAITING_VENDORS);
          (this.searchOpt.searchValue = this.requestBody.searchValue === '' ? null : this.requestBody.searchValue),
            (this.searchOpt.projectTypeId = ProjectTypeEnum.PRODUCTION_PROJECT);
        }
        switch (this.type) {
          case 'pm-suborder-relase-queue':
            ob = this.projectService.getAllSuborderReleaseQueue(filterOption, this.searchOpt);
            break;
          default:
        }
        ob.subscribe(
          data => {
            this.spinner.hide('loadingPanel');
            if (!data || !data.length) {
              return;
            }
            const rowsThisPage = data.map(item => {
              return {
                ...item
              };
            });
            this.totalRows = data[0].totalRowCount || 0;
            const lastRow = data.totalRowCount <= params.endRow ? data[0].totalRowCount : -1;

            if (data && data[0].totalRowCount) {
              params.successCallback(rowsThisPage, lastRow);
            }
          },
          error => {
            this.spinner.hide('loadingPanel');
          }
        );
      }
    };
    if (this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.setSortModel([
      {
        colId: 'orderId',
        sort: 'desc'
      }
    ]);
    this.setDataSource();
  }

  initColumnDef() {
    this.columnDefs = [
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
        headerName: 'Part/Suborder ID',
        field: 'partIds',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'partIds'
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
        headerName: 'Material',
        field: 'material',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'material '
      },
      {
        headerName: 'Technology',
        field: 'equipment',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'equipment '
      },
      {
        headerName: ' Delivery Date',
        field: 'targetDeliveryDate',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'targetDeliveryDate',
        valueFormatter: dt => {
          let value = (dt.value || '').toString();
          value = value.indexOf('+') > -1 ? value.split('+')[0] : value;
          return this.datePipe.transform(value, Util.dateFormatWithTime);
        }
      },
      {
        headerName: 'Aditional Assurances',
        field: 'additionalGuidance',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'additionalGuidance'
      },
      {
        headerName: 'Same Vendor',
        field: 'sameVendor',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'sameVendor'
      },
      {
        headerName: 'Action',
        field: '',
        // cellRenderer: 'templateRenderer',
        // cellRendererParams: {
        //   ngTemplate: this.selectButton
        // },
        hide: false,
        sortable: false,
        filter: false,
        suppressSizeToFit: true
      }
    ];
  }

  toggleTestAccount() {
    this.searchOpt.showTestAccount = !this.searchOpt.showTestAccount;
    this.setDataSource();
  }
}
