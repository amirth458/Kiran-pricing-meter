import { Component, OnInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as processProfiles from '../../../assets/static/processProfile';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

@Component({
  selector: 'app-process-profile',
  templateUrl: './process-profile.component.html',
  styleUrls: ['./process-profile.component.css']
})
export class ProcessProfileComponent implements OnInit {

  searchColumns = [
    {
      name: 'Process Profile No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      field: 'processProfileName', query: {
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
      name: 'Process Type', checked: false,
      field: 'processType', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Layer Height', checked: false,
      field: 'layerHeight', query: {
        type: '',
        filter: '',
      }
    },

    {
      name: 'Infill', checked: false,
      field: 'infill', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Tolerance Base', checked: false,
      field: 'toleranceBase', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Tensile Strength', checked: false,
      field: 'tensileStrength', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Tensile Modulus', checked: false,
      field: 'tensileModulus', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Surface Finish', checked: false,
      field: 'surfaceFinish', query: {
        type: '',
        filter: '',
      }
    }
  ];
  filterColumns = [
    {
      name: 'Process Profile No', checked: true, field: 'id'
    },
    {
      name: 'Process Profile Name', checked: true, field: 'processProfileName'
    },
    {
      name: 'Equipment', checked: true, field: 'equipment'
    },
    {
      name: 'Process Type', checked: false, field: 'processType'
    },
    {
      name: 'Layer Height', checked: false, field: 'layerHeight'
    },

    {
      name: 'Infill', checked: false, field: 'infill'
    },
    {
      name: 'Tolerance Base', checked: true, field: 'toleranceBase'
    },
    {
      name: 'Tensile Strength', checked: false, field: 'tensileStrength'
    },
    {
      name: 'Tensile Modulus', checked: true, field: 'tensileModulus'
    },
    {
      name: 'Surface Finish', checked: true, field: 'surfaceFinish'
    },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [
    { headerName: 'Process Profile No', field: 'id', hide: false, sortable: true, filter: true },
    { headerName: 'Process Profile Name', field: 'processProfileName', hide: false, sortable: true, filter: true },
    { headerName: 'Equipment', field: 'equipment', hide: false, sortable: true, filter: true },
    { headerName: 'Process Type', field: 'processType', hide: true, sortable: true, filter: true },
    { headerName: 'Layer Height', field: 'layerHeight', hide: false, sortable: true, filter: true },
    { headerName: 'Infill', field: 'infill', hide: false, sortable: true, filter: true },
    { headerName: 'Tolerance Base', field: 'toleranceBase', hide: false, sortable: true, filter: true },
    { headerName: 'Tensile Strength', field: 'tensileStrength', hide: false, sortable: true, filter: true },
    { headerName: 'Tensile Modulus', field: 'tensileModulus', hide: false, sortable: true, filter: true },
    { headerName: 'Surface Finish', field: 'surfaceFinish', hide: false, sortable: true, filter: true },
    {
      headerName: 'Actions',
      width: 140,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          copy: (param) => this.copyRow(param),
          delete: (param) => this.deleteRow(param),
          canEdit: true,
          canCopy: true,
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
    this.rowData = processProfiles;
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





// TODO:
// Copy row icon and functionality
