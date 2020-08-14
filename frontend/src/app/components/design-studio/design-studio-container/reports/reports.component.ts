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
import { Observable } from 'rxjs';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent extends RfqListComponent implements OnInit {
  @ViewChild('reportsActions') reportsActions: ElementRef;

  placeholderText = 'Customer, RFQ, Part, Order';
  public sorting = 'rfq_id,desc';
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
    public reportService: ReportService
  ) {
    super(spinner, router, projectService, partService, modalService, datePipe);
  }

  ngOnInit() {
    super.ngOnInit();
    this.gridOptions.frameworkComponents = this.frameworkComponents;
    this.gridOptions.onRowClicked = param => {};
    this.filter$.pipe(filter(f => f !== null)).subscribe(form => {
      this.apply({
        searchQuery: form.query || '',
        beginDate: form.dateRange[0],
        endDate: form.dateRange[1]
      });
    });
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Report ID',
        field: 'rfqId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqId',
        width: 100
      },
      {
        headerName: 'Order ID',
        field: 'rfqId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqId',
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
        field: 'rfqId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqId',
        width: 100
      },
      {
        headerName: 'Report Status',
        field: 'part_certificates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'part_certificates'
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
          if (data && data.totalElements) {
            params.successCallback(data.content || [], lastRow);
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
  }
  onDownload(row) {
    console.log(row);
  }
  onView(row) {
    console.log(row);
  }
}
