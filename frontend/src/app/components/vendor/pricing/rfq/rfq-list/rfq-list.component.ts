import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ColDef, GridOptions, RowClickedEvent } from 'ag-grid-community';
import { Part, RfqFilter, RfqTypeEnum } from '../../../../../model/part.model';
import { ProjectTypeEnum } from '../../../../../model/order.model';
import { FilterOption } from '../../../../../model/vendor.model';
import { ProjectService } from '../../../../../service/project.service';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.css']
})
export class RfqListComponent implements OnInit {
  @ViewChild('partsTemplate') partsTemplate: TemplateRef<any>;

  columnDefs: ColDef[] = [];
  gridOptions: GridOptions;
  pageSize = 10;
  placeholderText = 'Customer, RFQ, Part, Order';
  totalRows: number;

  rfqType = RfqTypeEnum.AUTO_RFQ;
  projectType = ProjectTypeEnum.RFQ_PROJECT;
  util = Util;
  id: number;
  parts: Array<Part>;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public projectService: ProjectService,
    public rfqPricingService: RfqPricingService,
    public modalService: NgbModal,
    public datePipe: DatePipe
  ) {}

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
        row.event.preventDefault();
        row.event.stopPropagation();
        const rowData = row.data || (null as any);
        if (rowData) {
          this.viewRfq(rowData.rfqId);
        }
      }
    };
    this.filter$.pipe(filter(f => f !== null)).subscribe(form => {
      this.apply({
        projectTypeId: this.projectType,
        searchQuery: form.query || '',
        beginDate: form.dateRange[0],
        endDate: form.dateRange[1],
        showTestAccount: false
      });
    });
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
        tooltipField: 'rfqCreatedAt',
        valueFormatter: dt => {
          let value = (dt.value || '').toString();
          value = value.indexOf('+') > -1 ? value.split('+')[0] : value;
          return this.datePipe.transform(value, Util.dateFormatWithTime);
        }
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

  apply(form: RfqFilter) {
    const dataSource = {
      rowCount: null,
      getRows: params => {
        const req: FilterOption = {
          page: params.startRow / this.pageSize,
          size: this.pageSize,
          sort: 'rfq_id,asc'
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

  filterData(req: FilterOption, form: RfqFilter): Observable<any> {
    return this.projectService.searchRfq(req, form);
  }

  onGridReady(event: any) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  closeModalWindow() {
    this.id = null;
    this.parts.length = 0;
    this.modalService.dismissAll();
  }

  viewRfq(rfqId: number) {
    this.spinner.show();
    this.id = rfqId;
    this.rfqPricingService.getRfqDetail(rfqId).subscribe((v: any) => {
      this.parts = [];
      const parts = [];
      (v.rfqMediaList || []).map(media => {
        media.partList.map(part => {
          parts.push(part);
        });
      });
      this.parts = parts;
      this.modalService.open(this.partsTemplate, {
        centered: true,
        windowClass: 'rfq-status-modal'
      });
      this.spinner.hide();
    });
  }
}
