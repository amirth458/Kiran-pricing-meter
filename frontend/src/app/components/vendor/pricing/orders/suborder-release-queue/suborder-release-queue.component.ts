import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { GridOptions } from 'ag-grid-community';

import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { OrdersService } from '../../../../../service/orders.service';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-suborder-release-queue',
  templateUrl: './suborder-release-queue.component.html',
  styleUrls: ['./suborder-release-queue.component.css']
})
export class SuborderReleaseQueueComponent implements OnInit {
  @ViewChild('selectBtn') selectBtn: TemplateRef<any>;

  type = ['search', 'filter'];

  searchColumns = [
    {
      name: 'Customer Order',
      field: 'customerOrder',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Sub-Order',
      field: 'partId',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Price Accepted',
      field: 'priceAccepted',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Customer Name',
      field: 'customerName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Quantity',
      field: 'quantity',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Material',
      field: 'materialPropertyValues',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Process',
      field: 'process',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Post-Process',
      field: 'postProcessTypeNames',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Delivery Date',
      field: 'deliveryDate',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Customer Order',
      field: 'customerOrder',
      checked: true
    },
    {
      name: 'Sub-Order',
      field: 'partId',
      checked: true
    },
    {
      name: 'Price Accepted',
      field: 'priceAccepted',
      checked: true
    },
    {
      name: 'Customer',
      field: 'customerName',
      checked: true
    },
    {
      name: 'Quantity',
      field: 'quantity',
      checked: true
    },
    {
      name: 'Material',
      field: 'materialPropertyValues',
      checked: true
    },
    {
      name: 'Process',
      field: 'process',
      checked: true
    },
    {
      name: 'Post-Process',
      field: 'postProcessTypeNames',
      checked: true
    },
    {
      name: 'Delivery Date',
      field: 'deliveryDate',
      checked: true
    }
  ];

  selectedIds = [];

  columnDefs: Array<any> = [];
  gridOptions: GridOptions;
  rowData;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private orderService: OrdersService,
    public datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    this.initColumns();
    localStorage.setItem('selectedSubOrders', '');
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        if (event.data) {
          this.router.navigateByUrl(`${this.router.url}/order/${event.data.partId}`);
        }
      }
    };
    this.getSubOrderReleaseQueue();
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Customer Order',
        field: 'customerOrder',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Sub-Order',
        field: 'partId',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Price Accepted',
        field: 'priceAccepted',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Customer',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Material',
        field: 'materialPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'Technology',
        field: 'equipmentPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , ')
      },
      {
        headerName: 'NDA',
        field: 'nda',
        hide: true,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Post-Process',
        field: 'postProcessTypeNames',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Delivery Date',
        field: 'deliveryDate',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => this.datePipe.transform(dt.value || '', Util.dateFormat)
      },
      {
        headerName: '',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.selectBtn
        }
      }
    ];
  }

  async getSubOrderReleaseQueue(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.orderService
          .getSubOrderReleaseQueue({ page, size: 1000, sort: 'id,ASC', q })
          .toPromise();
        if (!res.content) {
          break;
        }
        rows.push(...res.content);
        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  configureColumnDefs() {
    this.filterColumns.map(column => {
      this.columnDefs.map(col => {
        if (col.headerName === column.name) {
          col.hide = !column.checked;
        }
      });
    });
  }

  filterColumnsChange(event) {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(columns) {
    this.searchColumns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(
        column.field
      );
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({ type: '', filter: '' });
        }
      }
    });
    this.gridOptions.api.onFilterChanged();
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.setSortModel([
      {
        colId: 'partId',
        sort: 'desc'
      }
    ]);
  }

  toggleSelection(ev, id) {
    ev.stopPropagation();
    const selectedIds = [...this.selectedIds];
    const idx = selectedIds.findIndex(item => item === id);
    if (idx === -1) {
      selectedIds.push(id);
    } else {
      selectedIds.splice(idx, 1);
    }
    this.selectedIds = selectedIds;
  }

  advanceToVendorSelection() {
    localStorage.setItem(
      'selectedSubOrders',
      JSON.stringify(
        this.rowData.filter(
          item =>
            this.selectedIds.find(id => id === item.partId) !== undefined
        )
      )
    );
    this.router.navigateByUrl(`${this.router.url}/vendor`, {
      state: { subOrders: this.selectedIds }
    });
  }
}
