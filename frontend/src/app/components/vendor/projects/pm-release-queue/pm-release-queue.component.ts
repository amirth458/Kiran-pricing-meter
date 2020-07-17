import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { BiddingService } from '../../../../service/bidding.service';
import { FilterOption } from '../../../../model/vendor.model';
import { PartService } from '../../../../service/part.service';
import { Part } from '../../../../model/part.model';
import { PmProjectRequest } from '../../../../model/bidding.order';
import { TemplateRendererComponent } from '../../../../common/template-renderer/template-renderer.component';

@Component({
  selector: 'app-pm-release-queue',
  templateUrl: './pm-release-queue.component.html',
  styleUrls: ['./pm-release-queue.component.css']
})
export class PmReleaseQueueComponent implements OnInit {
  @ViewChild('partsTemplate') partsTemplate: TemplateRef<any>;
  @ViewChild('partsCell') partsCell: TemplateRef<any>;

  gridOptions: GridOptions;
  columnDefs: ColDef[] = [];
  pageSize = 50;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  placeholderText = 'Customer, RFQ, Part, Order';
  totalRows: number;
  id: number;
  parts: Array<Part>;

  filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  refresh$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public biddingService: BiddingService,
    public partService: PartService,
    public modalService: NgbModal
  ) {}

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
    this.filter$.pipe(filter(f => f !== null)).subscribe(form => {
      this.apply({
        bidPmProjectStatusIds: '1,2,3',
        searchValue: form.query || null,
        beginDate: form.dateRange[0],
        endDate: form.dateRange[1]
      });
    });
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
        tooltipField: 'partIds',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.partsCell
        }
      }
    ];
  }

  apply(form: PmProjectRequest) {
    const dataSource = {
      rowCount: null,
      getRows: params => {
        const req: FilterOption = {
          page: params.startRow / this.pageSize,
          size: this.pageSize,
          sort: ''
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

  public filterData(req: FilterOption, form: PmProjectRequest): Observable<any> {
    return this.biddingService.getPmProjectReleaseQueue(req, form);
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  closeModalWindow() {
    this.id = null;
    this.parts.length = 0;
    this.modalService.dismissAll();
  }

  viewRfq(row: any, $event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.spinner.show();
    this.id = row.bidPmProjectId || '';
    this.partService
      .getPartsById(row.partIds || [])
      .pipe(catchError(err => of([])))
      .subscribe((parts: any) => {
        this.parts = parts;
        const options = {
          centered: true,
          windowClass: 'rfq-status-modal',
          scrollable: true
        };
        this.modalService.open(this.partsTemplate, options);
        this.spinner.hide();
      });
  }
}
