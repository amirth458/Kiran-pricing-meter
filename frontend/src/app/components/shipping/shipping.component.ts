import { Component, OnInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as shipping from '../../../assets/static/shipping';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { CarrierCellRendererComponent } from 'src/app/common/carrier-cell-renderer/carrier-cell-renderer.component';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {
  searchColumns = [
    {
      name: 'Carrier No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Carrier', checked: false,
      field: 'carrier', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Account ID', checked: false,
      field: 'accountId', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Status', checked: false,
      field: 'status', query: {
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
      name: 'Carrier No', checked: true, field: 'id'
    },
    {
      name: 'Carrier', checked: true, field: 'carrier'
    },
    {
      name: 'Account ID', checked: true, field: 'accountId'
    },
    {
      name: 'Status', checked: true, field: 'status'
    },
    {
      name: 'Actions', checked: true, field: 'actions'
    },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
    carrierCellRenderer: CarrierCellRendererComponent
  };

  columnDefs = [
    { headerName: 'Carrier No', field: 'id', hide: false, sortable: true, filter: true },
    {
      headerName: 'Carrier', field: 'carrier', hide: false, sortable: true, filter: true,
      cellRenderer: 'carrierCellRenderer',
    },
    { headerName: 'Account ID', field: 'accountId', hide: false, sortable: true, filter: true },
    { headerName: 'Status', field: 'status', hide: false, sortable: true, filter: true },
    {
      headerName: 'Actions',
      width: 50,
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
  constructor(public route: Router) { }

  ngOnInit() {
    this.rowData = shipping;
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



