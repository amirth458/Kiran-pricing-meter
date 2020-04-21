import { Component, OnInit, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions, ColDef } from 'ag-grid-community';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { Customer } from 'src/app/model/customer.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild('actionControl') actionControl: TemplateRef<any>;
  @ViewChild('subscriptionCell') subscriptionCell;
  @ViewChild('subscriptionModal') subscriptionModal;

  searchColumns = [
    {
      name: 'Customer ID',
      checked: false,
      field: 'customerId',
      query: {
        type: '',
        filter: ''
      }
    },
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
    },
    {
      name: 'Last Login Attempt',
      checked: false,
      field: 'userLastLoginAttempt',
      query: {
        type: '',
        filter: ''
      }
    }
  ];
  filterColumns = [
    {
      name: 'Customer ID',
      checked: true,
      field: 'customerId'
    },
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
    },
    {
      name: 'Last Login Attempt',
      checked: true,
      field: 'userLastLoginAttempt'
    }
  ];
  type = ['search', 'filter'];

  subscriptions = [];
  addons = [];
  contractInfo;
  customerId;

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
    private toastr: ToastrService,
    private metadataService: MetadataService,
    private userService: UserService,
    private modalService: NgbModal
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {
    this.metadataService.getCustomerSubscriptionTypes().subscribe(v => (this.subscriptions = v));
    this.metadataService.getCustomerAddons().subscribe(v => (this.addons = v));

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
      paginationAutoPageSize: true,
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
        headerName: 'Customer ID',
        field: 'customerId',
        hide: false,
        sortable: true,
        filter: false
      },
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
        headerName: 'Last Login Attempt',
        field: 'userLastLoginAttempt',
        hide: true,
        sortable: true,
        filter: false,
        valueFormatter: v => {
          const value = v.value;
          if (!value) {
            return '';
          }
          return new Date(value).toLocaleString();
        }
      },
      {
        headerName: 'Subscription',
        filter: false,
        width: 170,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.subscriptionCell
        }
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
    while (currentData.length) {
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

  subscription(ev, row) {
    console.log(row);
    ev.stopPropagation();
    this.customerId = row.customerId;
    this.userService
      .getCustomerContract(this.customerId)
      .pipe(catchError(e => this.handleResponseError(e)))
      .subscribe(v => {
        console.log(v);
        this.contractInfo = v;

        this.modalService.open(this.subscriptionModal, {
          centered: true,
          size: 'lg'
        });
      });
  }

  setSubscription(v) {
    if (this.contractInfo) {
      this.userService.updateCustomerContract(this.contractInfo.contract.id, v.addon, v.subscription).subscribe(v => {
        this.modalService.dismissAll();
      });
    } else {
      this.userService.setCustomerContract(this.customerId, v.addon, v.subscription).subscribe(v => {
        this.modalService.dismissAll();
      });
    }
  }

  handleResponseError(e) {
    const message = (e.error && e.error.message) || 'Get Customer Contract occurs an error.';
    this.toastr.error(`${message} Please contact your admin`);

    return throwError('Error');
  }
}
