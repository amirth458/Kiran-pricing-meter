import { Component, OnInit, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as machines from '../../../assets/static/machines';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { VendorService } from '../../service/vendor.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  searchColumns = [
    {
      name: 'Machine No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Machine Name', checked: false,
      field: 'machineName', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Facility', checked: false,
      field: 'facility', query: {
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
      name: 'Serial Number', checked: false,
      field: 'serialNumber', query: {
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
      name: 'Actions', checked: false,
      field: 'actions', query: {
        type: '',
        filter: '',
      }
    },
  ];
  filterColumns = [
    {
      name: 'Machine No', checked: true, field: 'id'
    },
    {
      name: 'Machine Name', checked: true, field: 'machineName'
    },
    {
      name: 'Facility', checked: true, field: 'facility'
    },
    {
      name: 'Equipment', checked: true, field: 'equipment'
    },
    {
      name: 'Serial Number', checked: true, field: 'serialNumber'
    },

    {
      name: 'Material', checked: true, field: 'material'
    },
    {
      name: 'Actions', checked: true, field: 'actions'
    },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [
    { headerName: 'Machine No', field: 'id', hide: false, sortable: true, filter: true },
    { headerName: 'Machine Name', field: 'machineName', hide: false, sortable: true, filter: true },
    { headerName: 'Facility', field: 'facility', hide: false, sortable: true, filter: true },
    { headerName: 'Equipment', field: 'equipment', hide: false, sortable: true, filter: true },
    { headerName: 'Serial Number', field: 'serialNumber', hide: false, sortable: true, filter: true },
    { headerName: 'Material', field: 'material', hide: false, sortable: true, filter: true },
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

  constructor(
    public route: Router,
    public vendorService: VendorService
  ) { }

  ngOnInit() {
    this.rowData = machines;

    this.vendorService.getMachinery(330).subscribe(res => {
      console.log(res);
    });

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
