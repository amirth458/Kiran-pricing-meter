import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DatePipe } from '@angular/common';

import { FilterOption } from 'src/app/model/vendor.model';
import { ProjectService } from 'src/app/service/project.service';
import { SearchOpt } from './pm-suborder-release-queue.model';
import { ProjectTypeEnum } from 'src/app/model/order.model';
import { AppPartStatusId, Part } from 'src/app/model/part.model';
import { Util } from 'src/app/util/Util';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { MetadataService } from 'src/app/service/metadata.service';
import { ToastrService } from 'ngx-toastr';
import { PartService } from 'src/app/service/part.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild('partIdCell') partIdCell: TemplateRef<any>;
  @ViewChild('thumbnailCell') thumbnailCell: TemplateRef<any>;
  @ViewChild('partsTemplate') partsTemplate: TemplateRef<any>;

  gridOptions: GridOptions;
  navigation;
  id: number;
  parts: Array<Part>;
  pageSize = 10;
  type = '';
  selectedVendors = [];
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent,
    templateRenderer: TemplateRendererComponent
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
    public route: ActivatedRoute,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    public router: Router,
    public modalService: NgbModal,
    public metadataService: MetadataService,
    public projectService: ProjectService,
    public partService: PartService
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
      rowHeight: 50,
      headerHeight: 40,
      rowBuffer: 0,
      cacheBlockSize: this.pageSize,
      infiniteInitialRowCount: 0,
      cacheOverflowSize: 0,
      onRowClicked: event => {}
    };
  }

  /*onClick row selection*/
  onRowSelect(selectedRow) {
    const { customerOrderId, partIds } = selectedRow;
    let selectedCustomers = { customerOrderId, partIds };

    if (!this.selectedVendors.length) {
      this.selectedVendors.push(selectedCustomers);
      selectedRow.selected = true;
      return;
    }
    const isExisit = this.selectedVendors.find(item => item.customerOrderId == selectedRow.customerOrderId);
    if (isExisit) {
      this.selectedVendors = this.selectedVendors.filter(item => item.customerOrderId !== selectedRow.customerOrderId);
      selectedRow.selected = false;
    } else {
      this.selectedVendors.push(selectedCustomers);
      selectedRow.selected = true;
    }
  }

  onQueryChange(ev) {
    this.requestBody.searchValue = ev;
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

  /* Create Bid method*/
  onClickAdvancedToVendor() {
    if (!this.selectedVendors.length) {
      return;
    }

    this.spinner.show('loadingPanel');
    const bidPmProjectRequest = [];
    this.selectedVendors.map(item => {
      item.partIds.map(partId => {
        bidPmProjectRequest.push({ customerOrderId: item.customerOrderId, partId });
      });
    });

    this.projectService.createBidItems({ bidPmProjectRequest }).subscribe(
      response => {
        this.spinner.hide('loadingPanel');
        if (!response || !response.length) {
          return;
        }
        this.selectedVendors = [];
        const bidPmProject = response[0].bidPmProject;
        const statusName = (bidPmProject.bidPmProjectstatusType.name || '').replace(/_/g, '-').toLowerCase();
        const url = `/prodex/projects/pm-release-queue/${bidPmProject.id}/${statusName}`;
        this.router.navigateByUrl(url);
      },
      error => {
        console.log('Error', error);
        this.spinner.hide('loadingPanel');
      }
    );
  }

  toggleRelatedPart() {
    this.requestBody.includeRelatedPartIds = !this.requestBody.includeRelatedPartIds;
    this.initColumnDef();
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
        this.searchOpt.beginDate = this.requestBody.beginDate;
        this.searchOpt.endDate = this.requestBody.endDate;
        this.searchOpt.partStatusIds = AppPartStatusId.PART_AWAITING_RELEASE.toString();
        this.searchOpt.searchValue = this.requestBody.searchValue === '' ? null : this.requestBody.searchValue;
        this.searchOpt.projectTypeId = ProjectTypeEnum.PRODUCTION_PROJECT;

        ob = this.projectService.getAllSuborderReleaseQueue(filterOption, this.searchOpt);
        ob.subscribe(
          data => {
            this.spinner.hide('loadingPanel');
            if (!data || !data.length) {
              return;
            }

            this.totalRows = data[0].totalRowCount || 0;
            const lastRow = this.totalRows <= params.endRow ? this.totalRows : -1;
            if (data && this.totalRows) {
              params.successCallback(data || [], lastRow);
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

  closeModalWindow() {
    this.id = null;
    this.parts.length = 0;
    this.modalService.dismissAll();
  }

  showPartDetails(row: any, $event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.spinner.show();
    this.id = row.bidPmProjectId || '';

    combineLatest((row.partIds || []).map(id => this.partService.getPartByPartId(id)))
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
  /* Table headers */

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
        headerName: 'RFQ ID',
        field: 'rfqIds',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqIds'
      },
      {
        headerName: 'Part/Suborder IDs',
        field: 'partIds',
        tooltip: params => (params.value || []).join(', '),
        sortable: true,
        filter: false,
        width: 200,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.partIdCell
        }
      },
      {
        headerName: '',
        field: 'locations',
        hide: false,
        sortable: true,
        filter: false,
        width: 100,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.thumbnailCell
        }
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
          const arr = [];
          (dt.value || []).map(dt => {
            arr.push(this.datePipe.transform(dt, Util.dateFormat, 'UTC'));
          });
          return arr.length !== 0 ? arr.join(', ') : '';
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
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.selectButton
        },
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
