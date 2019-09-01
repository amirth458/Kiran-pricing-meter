import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as facilities from '../../../assets/static/facilities';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit, AfterViewInit {

  searchColumns = [
    {
      name: 'Equipment', checked: false, query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Layer Height', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Infill', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Tolerance Base', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },

    {
      name: 'Equipment', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Layer Height', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Infill', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
    {
      name: 'Tolerance Base', checked: false,
      query: {
        type: null,
        queryString: null,
      }
    },
  ];
  filterColumns = [
    {
      name: 'Equipment', checked: false
    },
    {
      name: 'Process Profile Name', checked: false
    },
    {
      name: 'Layer Height', checked: false
    },
    {
      name: 'Infill', checked: false
    },
    {
      name: 'Tolerance Base', checked: false
    },

    {
      name: 'Equipment', checked: false
    },
    {
      name: 'Process Profile Name', checked: false
    },
    {
      name: 'Layer Height', checked: false
    },
    {
      name: 'Infill', checked: false
    },
    {
      name: 'Tolerance Base', checked: false
    },
  ];
  activeColumns = [];
  options = [
    'is',
    `isn't`,
    `doesn't contain`,
    'starts with',
    'ends with',
    'is empty',
    'is not empty',
  ];
  type = ['search', 'filter'];


  columnDefs = [
    { headerName: 'Facility No', field: 'number', sortable: true, filter: true },
    { headerName: 'Facility Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    // { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    // { headerName: 'Address', field: 'address', sortable: true, filter: true },
    { headerName: 'City', field: 'city', sortable: true, filter: true },
    { headerName: 'State', field: 'state', sortable: true, filter: true },
    { headerName: 'Country', field: 'country', sortable: true, filter: true },
    // { headerName: 'Certification', field: 'certification', sortable: true, filter: true },
    {headerName: 'Actions', }
  ];
  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    pagination: true,
    paginationPageSize: 10
  };

  rowData = [
    ...facilities
  ];
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const temp = document.getElementsByClassName('ag-paging-panel')[0].innerHTML;
    const optionHTML = `
   <div class="page-size">
      Page Size:
      <select id="page-size">
        <option value="10" selected>10</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>
    </div>`;
    document.getElementsByClassName('ag-paging-panel')[0].innerHTML = optionHTML + temp;
    (document.getElementById('page-size') as any).addEventListener('change', ($event) => {
      this.onPageSizeChanged($event.target.value);
    });
  }

  onPageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
  }

}
