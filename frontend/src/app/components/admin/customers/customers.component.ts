import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions, ColDef } from 'ag-grid-community';

import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild('actionControl') actionControl: TemplateRef<any>;

  searchColumns = [
    {
      name: 'Customer Name',
      checked: false,
      field: 'customerName',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Company Name',
      checked: false,
      field: 'companyName',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Company Division',
      checked: false,
      field: 'companyDivision',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Industry',
      checked: false,
      field: 'industry',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Email Address',
      checked: false,
      field: 'email',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Country',
      checked: false,
      field: 'country',
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Customer Name',
      checked: true,
      field: 'customerName'
    },
    {
      name: 'Company Name',
      checked: true,
      field: 'companyName'
    },
    {
      name: 'Company Division',
      checked: true,
      field: 'companyDivision'
    },
    {
      name: 'Industry',
      checked: true,
      field: 'industry'
    },
    {
      name: 'Company Name',
      checked: true,
      field: 'companyName'
    },
    {
      name: 'Email Address',
      checked: true,
      field: 'email'
    },
    {
      name: 'Country',
      checked: true,
      field: 'country'
    }
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  columnDefs: ColDef[] = [];

  gridOptions: GridOptions;
  allUsers = [];
  rowData = [];
  pageSize = 10;
  navigation;
  constructor(
    private route: Router,
    private userService: UserService,
    private spineer: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {
    this.setColDef();
    this.getAllUsers();

    if (this.type.includes('filter')) {
      this.configureColumnDefs();
    }

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 40,
      // headerHeight: 35,

      onRowClicked: event => {
        // this.onRowClick(event);
      }
    };
  }

  setColDef() {
    this.columnDefs = [
      {
        headerName: 'Customer Name',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Company Division',
        field: 'companyDivision',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Industry',
        field: 'industry',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Email Address',
        field: 'email',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Country',
        field: 'country',
        hide: true,
        sortable: true,
        filter: false
      },
      {
        headerName: '',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.actionControl
        },
        hide: false,
        sortable: false,
        filter: false,
        width: 240
      }
    ];
  }
  getAllUsers() {
    this.rowData = [
      {
        id: 1,
        customerName: 'Mark Banton',
        companyName: 'Bravo',
        companyDivision: 'Medical Equipment',
        industry: 'PrintCo',
        email: 'alpha@email.com',
        country: 'USA',
        locked: true,
        active: true
      }
    ];
  }

  onView(customer) {
    this.toastr.warning('Feature in Progress');
  }
  onUnlock(customer) {
    this.rowData.map((c, index) => {
      if (c.id == customer.id) {
        this.rowData[index].locked = false;
      }
    });
  }
  onActivate(customer) {
    this.rowData.map((c, index) => {
      if (c.id == customer.id) {
        this.rowData[index].active = true;
      }
    });
  }
  onDeactivate(customer) {
    this.rowData.map((c, index) => {
      if (c.id == customer.id) {
        this.rowData[index].active = false;
      }
    });
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

  onGridReady(event) {
    this.gridOptions.api.sizeColumnsToFit();
  }
  pageSizeChanged(value) {
    this.gridOptions.api.paginationSetPageSize(Number(value));
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(event) {
    this.searchColumns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({
            type: '',
            filter: ''
          });
        }
        this.gridOptions.api.onFilterChanged();
      }
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
