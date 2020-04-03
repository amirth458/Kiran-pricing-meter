import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import { BehaviorSubject } from 'rxjs';

import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';

@Component({
  selector: 'app-vendor-order-status',
  templateUrl: './vendor-order-status.component.html',
  styleUrls: ['./vendor-order-status.component.css']
})
export class VendorOrderStatusComponent implements OnInit {
  @ViewChild('dateCell') dateCell: TemplateRef<any>;
  @ViewChild('jobNumberCell') jobNumberCell: TemplateRef<any>;
  @ViewChild('textCell') textCell: TemplateRef<any>;

  id: number;
  @Input()
  set bidProcessId(value: number) {
    this.id = value;
    if (value) {
      this.getVendorOrderInfo();
    }
  }
  get bidProcessId(): number {
    return this.id;
  }

  orderColDefs = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  gridOptions: GridOptions;
  orders = [];

  jobColDefs = [];
  jobGridOptions: GridOptions;
  selectedJobId$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  jobs = [];
  selectedJob: any;

  taskColDefs = [];
  taskGridOptions: GridOptions;
  tasks = [];

  constructor(public orderService: OrdersService) {}

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

  progressIndicatorClass(item: any): string {
    const cls = '';
    if (item && item.value) {
      return (item.value || '').toLowerCase().replace(/\s+/g, '-');
    }
    return cls;
  }

  getVendorOrderInfo() {
    this.orderService.getVendorOrderInfo(this.id).subscribe(v => {
      this.orders = v ? [v] : [];
      (v.vendorSubOrders || []).map(part => {
        const arr = [];
        (part.jobs || []).map(job => arr.push({ ...job, ...{ partId: part.id, orderId: v.id } }));
        this.jobs = arr;
      });
      this.selectedJob = this.jobs.length > 0 ? this.jobs[0] : null;
      this.viewTasks(this.selectedJob || {});
    });
  }

  initColumns() {
    this.orderColDefs = [
      { headerName: 'Vendor ID', field: 'vendorId', hide: false, sortable: false, filter: false },
      { headerName: 'Tracking Number', field: 'trackingNumber', hide: false, sortable: false, filter: false },
      {
        headerName: 'Order Status',
        field: 'vendorOrderStatusType.displayName',
        hide: false,
        sortable: false,
        filter: false
      }
    ];
    this.jobColDefs = [
      {
        headerName: 'Job',
        field: 'id',
        hide: false,
        filter: false,
        width: 100,
        maxWidth: 100,
        cellClass: 'p-0 progress-column',
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
        field: 'status.value',
        hide: false,
        filter: false
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
        headerName: 'Task No',
        field: 'taskNo',
        hide: false,
        sortable: true,
        filter: false,
        width: 120,
        maxWidth: 120,
        minWidth: 120,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.jobNumberCell
        }
      },
      {
        headerName: 'Stage',
        field: 'vendorTaskStage.value',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Task Description',
        headerTooltip: 'Task Description',
        cellClass: 'p-0',
        field: 'description',
        hide: false,
        sortable: false,
        filter: false,
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
        width: 250,
        minWidth: 250,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell,
          tooltipCell: true
        }
      },
      {
        headerName: 'Asset',
        field: 'asset',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell
        }
      },
      {
        headerName: 'Estimated Time To Complete Task',
        headerTooltip: 'Estimated Time To Complete Task',
        field: 'estimatedTaskTime',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Actual Task Time',
        headerTooltip: 'Actual Task Time',
        field: 'actualCompleteDateTime',
        cellClass: 'p-0',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.dateCell,
          tooltipCell: true
        }
      }
    ];
  }

  onFirstDataRendered() {
    this.jobGridOptions.api.getDisplayedRowAtIndex(0).setSelected(true);
  }

  onSelectionChanged() {
    const row = this.jobGridOptions.api.getSelectedRows()[0];
    this.selectedJob = row;
    this.viewTasks(row);
  }

  viewTasks(job: any) {
    this.tasks = job.tasks || [];
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
