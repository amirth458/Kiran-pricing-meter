import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ProjectType } from 'src/app/model/billing.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { Part } from 'src/app/model/part.model';
import { ProjectService } from 'src/app/service/project.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  autoQuotedIds = [];
  columnDefs = [];
  gridOptions: GridOptions;
  projectTypes = [];
  projectType = null;
  navigation;

  pageSize = 10;
  sort = 'id,desc';

  type: string = '';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public metadataService: MetadataService,
    public projectService: ProjectService
  ) {
    this.metadataService.getMetaData('project_type').subscribe(v => {
      this.projectTypes = v.map(item => ({ ...item, displayName: ProjectType[item.name] }));
    });

    this.type = router.url.split('/')[2];
  }

  ngOnInit() {
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
        headerName: 'Same Vendor',
        field: 'sameVendor',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'sameVendor'
      },
      {
        headerName: 'Customer',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'customerName'
      }
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      paginationPageSize: 20,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 1,
      rowModelType: 'infinite',
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        this.router.navigateByUrl(`${this.router.url}/${event.data.id}`);
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
            ob = this.projectService.getProjectReleaseQueue(filterOption, this.projectType);
            break;
          case 'vendor-confirmation-queue':
            ob = this.projectService.getConfirmationQueue(filterOption, this.projectType);
            break;
          case 'released-projects':
            ob = this.projectService.getReleasedProjects(filterOption, this.projectType);
            break;
          default:
        }
        ob.subscribe(data => {
          this.spinner.hide('spooler');
          const rowsThisPage = data.content.map((item: Part) => ({
            id: item.id,
            orderId: item.order && item.order.id,
            projectType: item.rfqMedia.projectRfq.projectType.name,
            sameVendor: item.order && item.order.isReleaseToSingleSupplier ? 'True' : 'False',
            customerName: item.order && item.order.customerName
          }));
          const lastRow = data.totalElements <= params.endRow ? data.totalElements : -1;
          console.log(data.totalElements, params.endRow, lastRow);
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
        colId: 'id',
        sort: 'desc'
      }
    ]);

    this.setDataSource();
  }

  onChangeProjectType(ev) {
    this.projectType = ev.target.value === 'null' ? null : ev.target.value;
    this.setDataSource();
  }
}
