import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ProjectType } from 'src/app/model/billing.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { Part } from 'src/app/model/part.model';
import { PartService } from 'src/app/service/part.service';

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
  projectType = '';
  rowData: any[] = [];
  pageSize = 10;
  navigation;

  type: string = '';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public metadataService: MetadataService,
    public partService: PartService
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
        field: 'order.id',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'order.id'
      },
      {
        headerName: 'Project Type',
        field: 'rfqMedia.projectRfq.projectType.name',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfqMedia.projectRfq.projectType.name',
        valueGetter: params => {
          return ProjectType[params.data.rfqMedia.projectRfq.projectType.name];
        }
      },
      {
        headerName: 'Same Vendor',
        field: 'sameVendor',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'projectType'
      },
      {
        headerName: 'Customer',
        field: 'order.customerName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'order.customerName'
      }
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        this.router.navigateByUrl(`${this.router.url}/${event.data.id}`);
      }
    };

    this.getRows();
  }

  async getRows(q = null) {
    this.spinner.show();
    switch (this.type) {
      case 'project-release-queue':
        this.partService.getProjectReleaseQueue().subscribe(v => {
          this.rowData = v;
          this.spinner.hide();
        });
        break;
      default:
        this.spinner.hide();
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
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }

  onChangeProjectType(ev) {
    this.projectType = ev.target.value;
  }

  get filteredData() {
    return this.projectType === ''
      ? this.rowData
      : this.rowData.filter(item => item.rfqMedia.projectRfq.projectType.id == this.projectType);
  }
}
