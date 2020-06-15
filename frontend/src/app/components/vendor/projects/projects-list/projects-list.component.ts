import { Component, OnInit } from '@angular/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MetadataService } from 'src/app/service/metadata.service';
import { Part, PartOrder } from 'src/app/model/part.model';
import { ProjectService } from 'src/app/service/project.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { Observable } from 'rxjs';
import { ConnectOrder } from 'src/app/model/connect.model';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  autoQuotedIds = [];
  columnDefs: ColDef[] = [];
  connectColumnDefs: ColDef[] = [];

  gridOptions: GridOptions;
  navigation;

  pageSize = 10;
  sort = 'id,desc';

  type = '';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public metadataService: MetadataService,
    public projectService: ProjectService
  ) {
    this.type = router.url.split('/')[3];
  }

  ngOnInit() {
    this.initColumnDef();

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs:
        this.type === 'release-queue' || this.type === 'order-complete' ? this.connectColumnDefs : this.columnDefs,
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
          this.type === 'release-queue' || this.type === 'order-complete'
            ? `${this.router.url}/${event.data.orderId}`
            : `${this.router.url}/${event.data.id}`;
        this.router.navigateByUrl(url);
      }
    };
  }

  setDataSource() {
    const dataSource = {
      rowCount: null,
      getRows: params => {
        const filterOption: FilterOption = {
          page: params.startRow / this.pageSize,
          size: this.pageSize,
          sort: this.sort
        };
        this.spinner.show('spooler');
        let ob: Observable<any> = null;
        switch (this.type) {
          case 'project-release-queue':
            ob = this.projectService.getProjectReleaseQueue(filterOption, null);
            break;
          case 'vendor-confirmation-queue':
            ob = this.projectService.getConfirmationQueue(filterOption, null);
            break;
          case 'released-projects':
            ob = this.projectService.getReleasedProjects(filterOption, null);
            break;
          case 'release-queue':
            ob = this.projectService.getConnectReleasedProjects(filterOption);
            break;
          case 'order-complete':
            ob = this.projectService.getConnectReleasedProjects(filterOption, true);
            break;
          default:
        }
        ob.subscribe(data => {
          this.spinner.hide('spooler');
          const rowsThisPage =
            this.type === 'release-queue' || this.type === 'order-complete'
              ? data.content.map((item: ConnectOrder) => ({
                  id: (item.partList || []).map(_ => _.id).join(', '),
                  orderId: item.id,
                  sameVendor: item.isReleaseToSingleSupplier ? 'True' : 'False',
                  customerName: item.customerName,
                  preferredVendors: item.minimumProdexSuppliers,
                  bidOrderStatus: item.bidOrderStatus || ''
                }))
              : data.content.map((item: Part) => ({
                  id: item.id,
                  orderId: item.order && item.order.id,
                  projectType:
                    item.rfqMedia &&
                    item.rfqMedia.projectRfq &&
                    item.rfqMedia.projectRfq.projectType &&
                    item.rfqMedia.projectRfq.projectType.name,
                  sameVendor: item.order && item.order.isReleaseToSingleSupplier ? 'True' : 'False',
                  customerName: item.order && item.order.customerName,
                  bidOrderStatus: item.bidOrderStatus || ''
                }));
          const lastRow = data.totalElements <= params.endRow ? data.totalElements : -1;
          params.successCallback(rowsThisPage, lastRow);
          // this.reconfigColumns();
        });
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
        headerName: 'Part ID',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'id'
      },
      {
        headerName: 'Order ID',
        field: 'orderId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'order.id'
      },
      {
        headerName: 'Project Type',
        field: 'projectType',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'projectType'
      },
      {
        headerName: 'Status',
        field: 'bidOrderStatus',
        hide: !(this.type === 'vendor-confirmation-queue' || this.type === 'released-projects'),
        sortable: true,
        filter: false,
        tooltipField: 'bidOrderStatus'
      },
      {
        headerName: 'Same Vendor',
        field: 'sameVendor',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'sameVendor'
      }
    ];

    this.connectColumnDefs = [
      {
        headerName: 'Order ID',
        field: 'orderId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'order.id'
      },
      {
        headerName: 'Part ID',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'id'
      }
    ];

    if (this.type === 'release-queue') {
      this.connectColumnDefs.push({
        headerName: 'ProdEX Supplier Requested',
        field: 'preferredVendors',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'preferredVendors'
      });
    }

    this.connectColumnDefs.push({
      headerName: 'Customer',
      field: 'customerName',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customerName'
    });

    this.columnDefs.push({
      headerName: 'Customer',
      field: 'customerName',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customerName'
    });
  }
}
