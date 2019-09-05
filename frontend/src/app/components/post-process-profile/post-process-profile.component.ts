import { Component, OnInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as postProcessProfile from '../../../assets/static/postProcessProfile';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

@Component({
  selector: 'app-post-process-profile',
  templateUrl: './post-process-profile.component.html',
  styleUrls: ['./post-process-profile.component.css']
})
export class PostProcessProfileComponent implements OnInit {


  searchColumns = [
    {
      name: 'Post-Process Profile No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Profile Name', checked: false,
      field: 'postProcessProfileName', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Asset', checked: false,
      field: 'asset', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Profile Family', checked: false,
      field: 'postProcessProfileFamily', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Type', checked: false,
      field: 'postProcessType', query: {
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
      name: 'Tolerance Increment', checked: false,
      field: 'toleranceIncrement', query: {
        type: '',
        filter: '',
      }
    },

  ];
  filterColumns = [
    {
      name: 'Post-Process Profile No', checked: true, field: 'id'
    },
    {
      name: 'Post-Process Profile Name', checked: true, field: 'postProcessProfileName'
    },
    {
      name: 'Asset', checked: true, field: 'asset'
    },
    {
      name: 'Post-Process Profile Family', checked: true, field: 'postProcessProfileFamily'
    },
    {
      name: 'Post-Process Type', checked: true, field: 'postProcessType'
    },
    {
      name: 'Material', checked: false, field: 'material'
    },

    {
      name: 'Tolerance Increment', checked: false, field: 'toleranceIncrement'
    }
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [
    { headerName: 'Post-Process Profile No', field: 'id', hide: false, sortable: true, filter: true },
    { headerName: 'Post-Process Profile Name', field: 'postProcessProfileName', hide: false, sortable: true, filter: true },
    { headerName: 'Asset', field: 'asset', hide: false, sortable: true, filter: true },
    { headerName: 'Post-Process Profile Family', field: 'postProcessProfileFamily', hide: false, sortable: true, filter: true },
    { headerName: 'Post-Process Type', field: 'postProcessType', hide: false, sortable: true, filter: true },
    { headerName: 'Material', field: 'material', hide: false, sortable: true, filter: true },
    { headerName: 'Tolerance Increment', field: 'toleranceIncrement', hide: false, sortable: true, filter: true },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          copy: (param) => this.copyRow(param),
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
    this.rowData = postProcessProfile;
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

  copyRow(event) {
    const startIndex = this.rowData.indexOf(event.data);
    const frontSlice = this.rowData.slice(0, startIndex + 1);
    const endSlice = this.rowData.slice(startIndex + 1);
    this.rowData = frontSlice.concat([{ ...event.data, id: '-' }].concat(endSlice));
    this.gridOptions.api.setRowData(this.rowData);

    // API Request to save the copied row
  }

  deleteRow(event) {
    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != event.data.id);
    this.rowData = filteredData;
    // API Request to delete the selected row

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


