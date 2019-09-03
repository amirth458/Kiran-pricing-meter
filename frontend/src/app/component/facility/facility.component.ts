import { Component, OnInit, AfterViewChecked, AfterViewInit, AfterContentInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as facilities from '../../../assets/static/facilities';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {

  searchColumns = [
    {
      name: 'Facility No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Facility Name', checked: false,
      field: 'facilityName', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Email', checked: false,
      field: 'email', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Phone', checked: false,
      field: 'phone', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Address', checked: false,
      field: 'address', query: {
        type: '',
        filter: '',
      }
    },

    {
      name: 'City', checked: false,
      field: 'city', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'State', checked: false,
      field: 'state', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Country', checked: false,
      field: 'country', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Certifications', checked: false,
      field: 'certifications', query: {
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
      name: 'Facility No', checked: true, field: 'id'
    },
    {
      name: 'Facility Name', checked: true, field: 'facilityName'
    },
    {
      name: 'Email', checked: true, field: 'email'
    },
    {
      name: 'Phone', checked: false, field: 'phone'
    },
    {
      name: 'Address', checked: false, field: 'address'
    },

    {
      name: 'City', checked: true, field: 'city'
    },
    {
      name: 'State', checked: true, field: 'state'
    },
    {
      name: 'Country', checked: false, field: 'country'
    },
    {
      name: 'Certifications', checked: true, field: 'certifications'
    },
    {
      name: 'Actions', checked: true, field: 'actions'
    },
  ];
  activeColumns = [];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [
    { headerName: 'Facility No', field: 'id', hide: false, sortable: true, filter: true },
    { headerName: 'Facility Name', field: 'facilityName', hide: false, sortable: true, filter: true },
    { headerName: 'Email', field: 'email', hide: false, sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', hide: true, sortable: true, filter: true },
    { headerName: 'Address', field: 'address', hide: false, sortable: true, filter: true },
    { headerName: 'City', field: 'city', hide: false, sortable: true, filter: true },
    { headerName: 'State', field: 'state', hide: false, sortable: true, filter: true },
    { headerName: 'Country', field: 'country', hide: false, sortable: true, filter: true },
    { headerName: 'Certifications', field: 'certifications', hide: false, sortable: true, filter: true },
    {
      headerName: 'Actions',
      width: 100,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          delete: (param) => this.deleteRow(param)
        }
      }
    }
  ];


  gridOptions: GridOptions;

  rowData;
  pageSize = 10;
  constructor(private route: Router) { }

  ngOnInit() {
    this.rowData = facilities;
    this.configureColumnDefs();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
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



