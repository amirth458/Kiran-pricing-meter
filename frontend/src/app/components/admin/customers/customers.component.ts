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
  @ViewChild('actionControl') actionControl;
  @ViewChild('subscriptionCell') subscriptionCell;
  @ViewChild('subscriptionModal') subscriptionModal;

  searchColumns = [];
  filterColumns = [];
  type = ['search', 'filter'];
  filterColumnsRequest = [];
  totalcounts = 0;

  matchingNames = {
    'Customer ID': 'customerId',
    'Customer Name': 'customerName',
    'First Name': 'userFirstName',
    'Last Name': 'userLastName',
    'Company Division': 'customerDivision',
    Industry: 'customerIndustries',
    'Email Address': 'userEmail',
    Country: 'customerCountry',
    'Last Login Attempt': 'userLastLoginAttempt'
  };

  subscriptions = [];
  addons = [];

  contractInfo;
  customerId;

  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  columnDefs: ColDef[] = [];
  requests = 0;

  gridOptions: GridOptions;
  allUsers = [];
  rowData: Customer[] = [];
  pageSize = 20;
  navigation;
  constructor(
    private route: Router,
    private customerService: CustomerService,
    private spineer: NgxSpinnerService,
    private toastr: ToastrService,
    private metadataService: MetadataService,
    private userService: UserService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {
    this.navigation = this.route.getCurrentNavigation();
    this.getSearchFilterColumns();
  }

  ngOnInit() {
    this.metadataService.getCustomerSubscriptionTypes().subscribe(v => (this.subscriptions = v));
    this.metadataService.getCustomerAddons().subscribe(v => (this.addons = v));

    localStorage.removeItem('viewCustomerInfo');
  }

  async getSearchFilterColumns() {
    const columns = await this.userService.getCustomerFilterColumns().toPromise();

    this.filterColumns = columns.map(column => ({
      name: column.displayName,
      checked: true,
      field: column.displayName
    }));

    this.searchColumns = columns.map(column => {
      return {
        id: column.id,
        name: column.displayName === 'Vendor Status' ? 'Approval Status' : column.displayName,
        checked: false,
        operators: column.operators,
        field: column.displayName,
        query: { type: '', filter: null }
      };
    });

    this.columnDefs.push(
      ...columns.map(column => ({
        headerName: column.displayName,
        field: this.matchingNames[column.displayName],
        hide: true,
        sortable: false,
        filter: false,
        tooltipField: this.matchingNames[column.displayName],
        headerTooltip: column.displayName
      }))
    );

    this.columnDefs.push(
      ...[
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
      ]
    );

    if (this.type.includes('filter')) {
      this.configureColumnDefs();
    }

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 40,
      headerHeight: 40,
      rowSelection: 'multiple',

      onRowDoubleClicked: event => {
        localStorage.setItem('viewCustomerInfo', JSON.stringify(event.data));
        this.route.navigateByUrl(`/user-manage/customers/view/user`);
      }
    };
  }

  onUnlock(customer: Customer) {
    console.log(customer);
    this.customerService.unlockCustomer(customer.customerId).subscribe(
      res => {
        this.onSearch();
      },
      err => {
        this.toastr.error('Unable to perform action');
      }
    );
  }

  onActivate(customer: Customer) {
    this.customerService.activateCustomer(customer.customerId).subscribe(
      res => {
        this.onSearch();
      },
      err => {
        this.toastr.error('Unable to perform action');
      }
    );
  }
  onDeactivate(customer: Customer) {
    this.customerService.deactivateCustomer(customer.customerId).subscribe(
      res => {
        this.onSearch();
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

  onGridReady(ev) {
    if (this.gridOptions) {
      this.gridOptions.api = ev.api;
      this.gridOptions.api.sizeColumnsToFit();
      this.searchColumnsChange();
    }
  }

  searchColumnsChange() {
    this.filterColumnsRequest = [];
    this.searchColumns.map(column => {
      if (column.checked && column.query.type) {
        this.filterColumnsRequest.push({
          id: column.id,
          displayName: column.name,
          selectedOperator: column.query.type,
          searchedValue: column.query.filter
        });
      }
    });
    this.onSearch();
  }

  onSearch() {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler');
        this.requests++;
        this.userService
          .getAllCustomers(params.startRow / this.pageSize, this.pageSize, {
            q: '',
            filterColumnsRequests: this.filterColumnsRequest
          })
          .subscribe(data => {
            if (--this.requests === 0) {
              this.spinner.hide('spooler');
            }
            const rowsThisPage = data.content;
            const lastRow = data.total <= params.endRow ? data.total : -1;
            this.totalcounts = data.total;
            params.successCallback(rowsThisPage, lastRow);
            // this.reconfigColumns();
          });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  filterColumnsChange() {
    this.reconfigColumns();
    this.searchColumnsChange();
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
