import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { RfqListComponent } from 'src/app/components/vendor/pricing/rfq/rfq-list/rfq-list.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/service/project.service';
import { PartService } from 'src/app/service/part.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { filter } from 'rxjs/operators';
import { FilterOption } from 'src/app/model/vendor.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ReportService } from 'src/app/service/report.service';
import { ProjectTypeEnum } from 'src/app/model/order.model';
import { RowClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent extends RfqListComponent implements OnInit {
  @ViewChild('reportsActions') reportsActions: ElementRef;

  placeholderText = 'Customer, RFQ, Part, Order';
  public sorting = 'reportId,desc';
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public projectService: ProjectService,
    public partService: PartService,
    public modalService: NgbModal,
    public datePipe: DatePipe,
    public reportService: ReportService,
    public toaster: ToastrService
  ) {
    super(spinner, router, projectService, partService, modalService, datePipe);
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
      onRowClicked: (row: RowClickedEvent): void => {
        this.router.navigateByUrl('/design-studio/reports/' + row.data.reportId);
      }
    };
    this.filter$.pipe(filter(f => f !== null)).subscribe(form => {
      this.apply({
        projectType: ProjectTypeEnum.DESIGN_REPORT,
        // TODO:
        // Change this with enum
        rfqStatusIds: '7,8,9,10',
        searchQuery: form.query || '',
        createdDateFrom: form.dateRange[0],
        createdDateTo: form.dateRange[1]
      });
    });
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Report ID',
        field: 'reportId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'reportId',
        width: 100
      },
      {
        headerName: 'Order ID',
        field: 'orderId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'orderId',
        width: 100
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
        headerName: 'Reports Requested',
        field: 'reportRequested',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'reportRequested',
        width: 100
      },
      {
        headerName: 'Report Status',
        field: 'status',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'status'
      },
      {
        headerName: '',
        field: '',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: '',
        cellRenderer: 'templateRenderer',
        width: 230,
        cellRendererParams: {
          ngTemplate: this.reportsActions
        }
      }
    ];
  }

  apply(form: any) {
    const dataSource = {
      rowCount: null,
      getRows: params => {
        const req: FilterOption = {
          page: params.startRow / this.pageSize,
          size: this.pageSize,
          sort: this.sorting
        };
        this.spinner.show('loadingPanel');
        this.filterData(req, form).subscribe(data => {
          this.spinner.hide('loadingPanel');
          this.totalRows = data.totalElements || 0;
          const lastRow = data.totalElements <= params.endRow ? data.totalElements : -1;

          if (data && data.length) {
            // TODO:
            // Fix this when API starts sending the appropriate pagination information
            params.successCallback(data || [], data.length);
          }
        });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  public filterData(req: FilterOption, form): Observable<any> {
    return this.reportService.getReportList(req, form);
  }

  onUpload(row) {
    console.log(row);
    this.toaster.warning('Feature Under Construction');
  }
  onDownload(row) {
    console.log(row);
    this.toaster.warning('Feature Under Construction');
  }
  onView(row) {
    console.log(row);
    this.toaster.warning('Feature Under Construction');
  }
}
