import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FileViewRendererComponent } from 'src/app/common/file-view-renderer/file-view-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-released-projects',
  templateUrl: './released-projects.component.html',
  styleUrls: ['./released-projects.component.css']
})
export class ReleasedProjectsComponent implements OnInit {
  autoQuotedIds = [];
  columnDefs = [];
  gridOptions: GridOptions;
  rowData: any[] = [];
  pageSize = 10;
  navigation;

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(public spinner: NgxSpinnerService, public router: Router) {}

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: 'Order ID',
        field: 'orderId',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'orderId'
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
        headerName: 'Part Count',
        field: 'partCount',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'partCount'
      },
      {
        headerName: 'Customer',
        field: 'customer',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'customer'
      },
      {
        headerName: 'Vendor',
        field: 'vendor',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'vendor'
      },
      {
        headerName: 'Price',
        field: 'price',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'price'
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
  }

  async getRows(q = null) {}
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
}