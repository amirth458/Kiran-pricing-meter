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
import { ProjectTypeEnum, OrderStatusTypeId } from 'src/app/model/order.model';

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
  requestBody = {
    projectTypeId: ProjectTypeEnum.CONNECT_PROJECT,
    partId: null,
    orderId: null,
    customerName: null,
    orderStatusId: null,
    searchValue: null,
    beginDate: null,
    endDate: null
  };
  totalRows = 0;
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

  onQueryChange(ev) {
    this.requestBody.searchValue = ev;
    this.setDataSource();
  }

  onCreatedDateChange(ev) {
    if (ev.length) {
      this.requestBody.beginDate = ev[0];
      this.requestBody.endDate = ev[1];
    }
    this.setDataSource();
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
            this.requestBody.orderStatusId = OrderStatusTypeId.VENDOR_DOWNSELECTION;
            ob = this.projectService.searchCustomerOrder(filterOption, this.requestBody);
            break;
          case 'order-complete':
            this.requestBody.orderStatusId = OrderStatusTypeId.ORDER_COMPLETE;
            ob = this.projectService.searchCustomerOrder(filterOption, this.requestBody);
            break;
          default:
        }
        ob.subscribe(data => {
          this.spinner.hide('spooler');
          const rowsThisPage =
            this.type === 'release-queue' || this.type === 'order-complete'
              ? data.map((item: ConnectOrder) => ({
                  id: (item.partIds || []).join(', '),
                  orderId: item.orderId,
                  sameVendor: item.isReleaseToSingleSupplier ? 'True' : 'False',
                  customerName: item.customerName,
                  preferredVendors: item.minimumProdexSuppliers,
                  orderStatusType: item.orderStatusType,
                  bidOrderStatus: item.bidOrderStatus || '',
                  prodexPartIds: item.prodexPartIds || [],
                  prodexRFQIds: item.prodexRFQIds || []
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
          if (this.type === 'release-queue' || this.type === 'order-complete') {
            this.totalRows = data && data[0] ? data[0].totalRowCount : 0;
            const lastRow = this.totalRows && this.totalRows <= params.endRow ? data[0].totalRowCount : -1;
            if (data && data.length) {
              params.successCallback(rowsThisPage, lastRow);
            }
          } else {
            this.totalRows = data.totalElements || 0;
            const lastRow = data.totalElements <= params.endRow ? data.totalElements : -1;
            if (data && data.totalElements) {
              params.successCallback(rowsThisPage, lastRow);
            }
          }
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
        headerName: 'Customer',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'customerName'
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
        headerName: 'Part ID',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'id'
      }
    ];

    if (this.type === 'release-queue') {
      this.connectColumnDefs = this.connectColumnDefs.concat([
        {
          headerName: 'ProdEX Supplier Requested',
          field: 'preferredVendors',
          hide: false,
          sortable: true,
          filter: false,
          tooltipField: 'preferredVendors'
        },
        {
          headerName: 'Order Status',
          field: 'orderStatusType',
          hide: false,
          sortable: true,
          filter: false,
          tooltipField: 'orderStatusType',
          valueFormatter: v => (v.value ? v.value.replace(/_/g, ' ') : '')
        }
      ]);
    }
    if (this.type === 'order-complete') {
      this.connectColumnDefs = this.connectColumnDefs.concat([
        {
          headerName: 'Related ProdEX Part IDs',
          field: 'prodexPartIds',
          hide: false,
          sortable: true,
          filter: false,
          tooltipField: 'prodexPartIds'
        },
        {
          headerName: 'Related ProdEX RFQ IDs',
          field: 'prodexRFQIds',
          hide: false,
          sortable: true,
          filter: false,
          tooltipField: 'prodexRFQIds'
        },
        {
          headerName: 'Order Status',
          field: 'orderStatusType',
          hide: false,
          sortable: true,
          filter: false,
          tooltipField: 'orderStatusType',
          valueFormatter: v => (v.value ? v.value.replace(/_/g, ' ') : '')
        }
      ]);
    }

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
