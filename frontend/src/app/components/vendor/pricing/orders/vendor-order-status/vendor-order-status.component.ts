import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vendor-order-status',
  templateUrl: './vendor-order-status.component.html',
  styleUrls: ['./vendor-order-status.component.css']
})
export class VendorOrderStatusComponent implements OnInit {
  @ViewChild('dateCell') dateCell: TemplateRef<any>;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('jobNumberCell') jobNumberCell: TemplateRef<any>;
  @ViewChild('textCell') textCell: TemplateRef<any>;

  @Input() orderId: number;
  @Input() partId: number;

  orderColDefs = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  gridOptions: GridOptions;
  rowData = [];

  jobColDefs = [];
  jobGridOptions: GridOptions;
  selectedJobId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  taskColDefs = [];
  taskGridOptions: GridOptions;

  constructor() {}

  ngOnInit() {
    this.initColumns();
    const defaultOptions = {
      frameworkComponents: this.frameworkComponents,
      pagination: true,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
    this.gridOptions = { ...defaultOptions, ...{ columnDefs: this.orderColDefs, pagination: false } };
    this.jobGridOptions = { ...{ columnDefs: this.jobColDefs }, ...defaultOptions };
    this.taskGridOptions = { ...{ columnDefs: this.taskColDefs }, ...defaultOptions };
  }

  initColumns() {
    this.orderColDefs = [
      { headerName: 'Vendor ID', field: 'vendorId', hide: false, sortable: true, filter: false },
      { headerName: 'Tracking Number', field: 'trackingNumber', hide: false, sortable: true, filter: false },
      { headerName: 'Order Status', field: 'orderStatus', hide: false, sortable: true, filter: false }
    ];
    this.jobColDefs = [
      {
        headerName: 'Job',
        field: 'id',
        hide: false,
        filter: false,
        width: 100,
        maxWidth: 100,
        cellClass: 'p-0',
        sort: 'desc',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.jobNumberCell
        }
      },
      {
        headerName: 'Due Date',
        field: 'dueDate',
        hide: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.dateCell
        }
      },
      {
        headerName: 'Create Date',
        field: 'createdDate',
        hide: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.dateCell
        }
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        hide: false,
        filter: false,
        width: 80
      },
      {
        headerName: 'Status',
        field: 'statusId',
        hide: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.statusCell
        }
      },
      {
        headerName: 'Estimated Completion',
        field: 'estimatedCompletionDate',
        hide: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.dateCell
        }
      },
      {
        headerName: 'Description',
        field: 'description',
        hide: false,
        filter: false
      }
    ];
    this.taskColDefs = [
      {
        headerName: '* Task No',
        field: 'taskNo',
        hide: false,
        sortable: true,
        filter: false,
        editable: true,
        width: 120,
        maxWidth: 120,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.jobNumberCell
        }
      },
      {
        headerName: '* Stage',
        field: 'vendorTaskStageId',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.statusCell
        }
      },
      {
        headerName: '* Task Description',
        headerTooltip: 'Task Description',
        cellClass: 'p-0',
        field: 'description',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        width: 250,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell,
          tooltipCell: true
        }
      },
      {
        headerName: 'Notes',
        field: 'notes',
        cellClass: 'p-0',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        width: 250,
        minWidth: 250,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell,
          tooltipCell: true
        }
      },
      {
        headerName: '* Asset',
        field: 'asset',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell
        }
      },
      {
        headerName: '* Estimated Task Time (HH:MM)',
        headerTooltip: 'Estimated Task Time (HH:MM)',
        field: 'estimatedTaskTime',
        hide: false,
        sortable: false,
        filter: false,
        editable: true
      },
      {
        headerName: 'Estimated Begin',
        headerTooltip: 'Estimated Begin',
        field: 'estimatedBeginDate',
        cellClass: 'p-0',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.dateCell,
          tooltipCell: true
        }
      },
      {
        headerName: 'Estimated Complete',
        headerTooltip: 'Estimated Complete',
        cellClass: 'p-0',
        field: 'estimatedCompletionDate',
        hide: false,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.dateCell,
          tooltipCell: true
        }
      }
    ];
  }

  onGridReady(type: string) {
    if (type === 'orders') {
      this.gridOptions.api.sizeColumnsToFit();
    } else if (type === 'jobs') {
      this.jobGridOptions.api.sizeColumnsToFit();
    } else {
      this.taskGridOptions.api.sizeColumnsToFit();
    }
  }
}
