import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions, ColDef } from 'ag-grid-community';

import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { CustomerService } from 'src/app/service/customer.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { Customer } from 'src/app/model/customer.model';

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
      field: 'name',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Company Name',
      checked: false,
      field: 'customerName',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Company Division',
      checked: false,
      field: 'customerDivision',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Industry',
      checked: false,
      field: 'customerIndustries',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Email Address',
      checked: false,
      field: 'userEmail',
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Country',
      checked: false,
      field: 'customerCountry',
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
      field: 'name'
    },
    {
      name: 'Company Name',
      checked: true,
      field: 'customerName'
    },
    {
      name: 'Company Division',
      checked: true,
      field: 'customerDivision'
    },
    {
      name: 'Industry',
      checked: true,
      field: 'customerIndustries'
    },
    {
      name: 'Email Address',
      checked: true,
      field: 'userEmail'
    },
    {
      name: 'Country',
      checked: true,
      field: 'customerCountry'
    }
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  columnDefs: ColDef[] = [];

  gridOptions: GridOptions;
  allUsers = [];
  rowData: Customer[] = [];
  pageSize = 10;
  navigation;
  constructor(
    private route: Router,
    private customerService: CustomerService,
    private spineer: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {
    localStorage.removeItem('viewCustomerInfo');
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
        field: 'name',
        hide: false,
        sortable: true,
        filter: false,
        valueGetter: value => {
          const data = value.data;
          return data.userFirstName + ' ' + data.userLastName;
        }
      },
      {
        headerName: 'Company Name',
        field: 'customerName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Company Division',
        field: 'customerDivision',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Industry',
        field: 'customerIndustries',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Email Address',
        field: 'userEmail',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Country',
        field: 'customerCountry',
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
  async getAllUsers() {
    this.spineer.show();
    let data = [];
    let page = 0;
    let filter: FilterOption = { size: 1000, sort: 'id,ASC', page, q: '' };
    let currentData = await this.customerService.getCustomer(filter).toPromise();
    while (currentData.length || page < 3) {
      page = page + 1;
      data = data.concat(currentData);
      filter = { size: 1000, sort: 'id,ASC', page, q: '' };
      currentData = await this.customerService.getCustomer(filter).toPromise();
    }
    this.rowData = data;
    this.spineer.hide();

    // this.customerService.getCustomer(filter).subscribe(
    //   data => {
    //     this.spineer.hide();
    //   },
    //   err => {
    //     this.toastr.error('Something went wrong. Please try again.');
    //     this.spineer.hide();
    //   }
    // );
  }

  onView(customer: Customer) {
    console.log({ customer });
    localStorage.setItem('viewCustomerInfo', JSON.stringify(customer));
    this.route.navigateByUrl('/user-manage/customers/view/user');
  }

  onUnlock(customer: Customer) {
    this.customerService.unlockCustomer(customer.customerId).subscribe(
      res => {
        this.getAllUsers();
      },
      err => {
        this.toastr.error('Unable to perform action');
      }
    );
  }

  onActivate(customer: Customer) {
    this.customerService.activateCustomer(customer.customerId).subscribe(
      res => {
        this.getAllUsers();
      },
      err => {
        this.toastr.error('Unable to perform action');
      }
    );
  }
  onDeactivate(customer: Customer) {
    this.customerService.deactivateCustomer(customer.customerId).subscribe(
      res => {
        this.getAllUsers();
      },
      err => {
        this.toastr.error('Unable to perform action');
      }
    );
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
