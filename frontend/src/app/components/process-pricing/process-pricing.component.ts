import { Component, OnInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as pricings from '../../../assets/static/processPricing';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

@Component({
  selector: 'app-process-pricing',
  templateUrl: './process-pricing.component.html',
  styleUrls: ['./process-pricing.component.css']
})
export class ProcessPricingComponent implements OnInit {


  searchColumns = [
    {
      name: 'Pricing No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Pricing Profile', checked: false,
      field: 'pricingProfile', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Process Profile', checked: false,
      field: 'processProfile', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Equipment', checked: false,
      field: 'equipment', query: {
        type: '',
        filter: '',
      }
    },

    {
      name: 'Material', checked: false,
      field: 'material', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Condition 1', checked: false,
      field: 'condition1', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Condition 2', checked: false,
      field: 'condition2', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Condition 3', checked: false,
      field: 'condition3', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Pricing Component 1', checked: false,
      field: 'pricingComponent1', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Pricing Component 2', checked: false,
      field: 'pricingComponent2', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Pricing Component 3', checked: false,
      field: 'pricingComponent3', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Pricing Component 4', checked: false,
      field: 'pricingComponent4', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Actions', checked: false,
      field: 'actions', query: {
        type: '',
        filter: '',
      }
    },
  ];
  filterColumns = [
    {
      name: 'No', checked: true, field: 'id'
    },
    {
      name: 'Pricing Profile', checked: true, field: 'pricingProfile'
    },
    {
      name: 'Process Profile', checked: true, field: 'processProfile'
    },
    {
      name: 'Equipment', checked: true, field: 'equipment'
    },
    {
      name: 'Material', checked: true, field: 'material'
    },
    {
      name: 'Condition 1', checked: true, field: 'condition1'
    },
    {
      name: 'Condition 2', checked: false, field: 'condition2'
    },
    {
      name: 'Condition 3', checked: false, field: 'condition3'
    },
    {
      name: 'Pricing Component 1', checked: true, field: 'pricingComponent1'
    },
    {
      name: 'Pricing Component 2', checked: false, field: 'pricingComponent2'
    },
    {
      name: 'Pricing Component 3', checked: false, field: 'pricingComponent3'
    },
    {
      name: 'Pricing Component 4', checked: false, field: 'pricingComponent4'
    }
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [
    { headerName: 'No', field: 'id', hide: false, sortable: true, filter: true },
    { headerName: 'Pricing Profile', field: 'pricingProfile', hide: false, sortable: true, filter: true },
    { headerName: 'Process Profile', field: 'processProfile', hide: false, sortable: true, filter: true },
    { headerName: 'Equipment', field: 'equipment', hide: false, sortable: true, filter: true },
    { headerName: 'Material', field: 'material', hide: false, sortable: true, filter: true },
    { headerName: 'Condition 1', field: 'condition1', hide: false, sortable: true, filter: true },
    { headerName: 'Condition 2', field: 'condition2', hide: false, sortable: true, filter: true },
    { headerName: 'Condition 3', field: 'condition3', hide: false, sortable: true, filter: true },
    { headerName: 'Pricing Component 1', field: 'condition1', hide: false, sortable: true, filter: true },
    { headerName: 'Pricing Component 2', field: 'condition2', hide: false, sortable: true, filter: true },
    { headerName: 'Pricing Component 3', field: 'condition3', hide: false, sortable: true, filter: true },
    { headerName: 'Pricing Component 4', field: 'condition3', hide: false, sortable: true, filter: true },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          delete: (param) => this.deleteRow(param),
          canEdit: true,
          canCopy: false,
          canDelete: true,
        }
      }
    }
  ];


  gridOptions: GridOptions;

  rowData;
  pageSize = 10;
  constructor(private route: Router) { }

  ngOnInit() {
    this.rowData = pricings;
    if (this.type.includes('filter')) {
      this.configureColumnDefs();
    }
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: (event) => {
        // this.onRowClick(event);
      }

    };
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();

    }, 50);
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

  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }

  deleteRow(event) {
    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != event.data.id);
    this.rowData = filteredData;
    console.log(this.rowData);
  }

  searchColumnsChange(event) {
    this.searchColumns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (column.checked) {
        columnInstance.setModel(column.query);
      } else {
        columnInstance.setModel({ type: '', filter: '' });
      }
      this.gridOptions.api.onFilterChanged();
    });
  }

  filterColumnsChange(event) {
    this.reconfigColumns();
    this.searchColumnsChange({});
  }

  reconfigColumns() {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }
}
