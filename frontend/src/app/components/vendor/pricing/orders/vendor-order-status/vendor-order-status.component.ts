import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import { BehaviorSubject } from 'rxjs';

import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-vendor-order-status',
  templateUrl: './vendor-order-status.component.html',
  styleUrls: ['./vendor-order-status.component.css']
})
export class VendorOrderStatusComponent implements OnInit {
  @ViewChild('dateCell') dateCell: TemplateRef<any>;
  @ViewChild('trackingNumber') trackingNumber: TemplateRef<any>;
  @ViewChild('jobNumberCell') jobNumberCell: TemplateRef<any>;
  @ViewChild('textCell') textCell: TemplateRef<any>;
  activeSubOrderId = null;
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

  @Input() order: number;
  @Output() orderChange: EventEmitter<number> = new EventEmitter<number>();

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
  activeTabJob = [];
  selectedJob: any;

  taskColDefs = [];
  taskGridOptions: GridOptions;
  tasks = [];
  parts = [];

  constructor(public orderService: OrdersService) {}

  ngOnInit() {
    if (!this.bidProcessId) {
      this.getVendorOrderInfoByOrderId();
    }

    this.initColumns();
    const defaultOptions = {
      frameworkComponents: this.frameworkComponents,
      pagination: true,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
    this.gridOptions = { ...defaultOptions, ...{ columnDefs: this.orderColDefs, pagination: false } };
    this.jobGridOptions = { ...defaultOptions, ...{ columnDefs: this.jobColDefs } };
    this.taskGridOptions = { ...defaultOptions, ...{ columnDefs: this.taskColDefs } };
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
      this.orderChange.emit(v ? v.id : null);
      (v.vendorSubOrders || []).map((part, index) => {
        const arr = [];
        (part.jobs || []).map(job => arr.push({ ...job, ...{ partId: part.id, orderId: v.id } }));
        this.jobs = this.jobs.concat(arr);
      });
      if (v.vendorSubOrders && this.activeSubOrderId === null) {
        this.activeSubOrderId = v.vendorSubOrders[0].id;
        this.updateActiveTabJobs();
      }
    });
  }

  getVendorOrderInfoByOrderId() {
    this.orderService.getVendorOrderInfoByOrderId(this.order).subscribe(v => {
      this.orders = v ? [v] : [];
      (v.vendorSubOrders || []).map(part => {
        const arr = [];
        (part.jobs || []).map(job => arr.push({ ...job, ...{ partId: part.id, orderId: v.id } }));
        this.jobs = this.jobs.concat(arr);
      });

      if (v.vendorSubOrders && this.activeSubOrderId == null) {
        this.activeSubOrderId = v.vendorSubOrders[0].id;
        this.updateActiveTabJobs();
      }
    });
  }

  get partList() {
    return (this.orders || []).length > 0 ? this.orders[0].vendorSubOrders : [];
  }

  updateActiveTabJobs() {
    this.activeTabJob = this.jobs.filter(job => job.partId === this.activeSubOrderId);
    if (this.jobGridOptions.api) {
      this.jobGridOptions.api.setRowData(this.activeTabJob);
    }
  }

  initColumns() {
    this.orderColDefs = [
      { headerName: 'Vendor ID', field: 'vendorId', hide: false, sortable: false, filter: false },
      {
        headerName: 'Tracking Number',
        field: 'trackingNumber',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.trackingNumber
        },
        valueFormatter: (dt: any) => {
          console.log({ dt });
          const carrier = dt.data && dt.data.shippingProvider ? `(${dt.data.shippingProvider.name})` : '';
          return dt.value ? `${dt.value} ${carrier}` : '';
        }
      },
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
        sortable: true,
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
        field: 'description',
        tooltipField: 'description',
        hide: false,
        sortable: false,
        filter: false,
        width: 250,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell
        }
      },
      {
        headerName: 'Notes',
        field: 'notes',
        tooltipField: 'notes',
        hide: false,
        sortable: false,
        filter: false,
        width: 250,
        minWidth: 250,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.textCell
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
        headerName: 'Estimated Completion Time',
        headerTooltip: 'Estimated Completion Time',
        field: 'estimatedCompletionDate',
        hide: false,
        sortable: false,
        filter: false,
        valueFormatter: dt => {
          return dt.value ? Util.parseUtcDateTime(dt.value) : '';
        }
      },
      {
        headerName: 'Estimated Task Time',
        headerTooltip: 'Estimated Task Time',
        field: 'taskTime',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Actual Task Time',
        headerTooltip: 'Actual Task Time',
        field: 'actualCompletionTime',
        hide: false,
        sortable: false,
        filter: false
      }
    ];
  }

  onFirstDataRendered() {
    this.jobGridOptions.api.getDisplayedRowAtIndex(0).setSelected(true);
  }

  onSelectionChanged() {
    const row = this.jobGridOptions.api.getSelectedRows()[0];
    this.selectedJob = row;
    this.viewTasks(row || {});
  }

  viewTasks(job: any) {
    (job.tasks || []).map((task: any) => {
      task.taskTime = Util.convertMinutesToDate(task.estimatedTaskTime);
      if (task.actualBeginDateTime && task.actualCompleteDateTime) {
        task.actualCompletionTime = Util.dateDiff(task.actualBeginDateTime, task.actualCompleteDateTime, 'minutes');
      }
    });
    this.tasks = job.tasks || [];
    if (this.taskGridOptions && this.taskGridOptions.columnApi && this.taskGridOptions.columnApi.getColumn('taskNo')) {
      this.taskGridOptions.columnApi.getColumn('taskNo').setSort('asc');
    }
    return job.tasks || [];
  }

  onTabChange(part) {
    this.activeSubOrderId = part.id;
    this.updateActiveTabJobs();
    if (this.activeTabJob) {
      this.selectedJob = this.activeTabJob[0];
      this.viewTasks(this.selectedJob || {});
    }
  }

  onGridReady(type: string) {
    if (type === 'orders') {
      this.gridOptions.api.sizeColumnsToFit();
    } else if (type === 'jobs') {
      this.updateActiveTabJobs();
      this.jobGridOptions.api.sizeColumnsToFit();
      this.jobGridOptions.columnApi.getColumn('id').setSort('desc');
    } else if (type === 'tasks') {
      this.taskGridOptions.api.sizeColumnsToFit();
      this.taskGridOptions.columnApi.getColumn('taskNo').setSort('asc');
    }
  }
}
