import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ColDef, GridOptions } from 'ag-grid-community';

import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { CustomerService } from 'src/app/service/customer.service';
import { UserService } from 'src/app/service/user.service';
import { Customer } from 'src/app/model/customer.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, throwError } from 'rxjs';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';
import { LinkVendorService } from 'src/app/service/link-vendor.service';
import { AppTypes } from '../../../store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit, OnDestroy {
  @ViewChild('actionControl') actionControl;
  @ViewChild('subscriptionCell') subscriptionCell;
  @ViewChild('subscriptionModal') subscriptionModal;
  @ViewChild('unlockCell') unlockCell;

  @ViewChild('linkVendorCell') linkVendorCell;
  @ViewChild('linkVendorModal') linkVendorModal;
  @ViewChild('changeCustomerAccountCell') changeCustomerAccountCell;

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
  selected: any;
  pageSize = 20;
  navigation;

  searchQuery: string;
  destroy$: Subject<boolean> = new Subject();
  searchDebouncer: Subject<any> = new Subject<any>();

  constructor(
    public route: Router,
    private store: Store<any>,
    public customerService: CustomerService,
    public spineer: NgxSpinnerService,
    public toastr: ToastrService,
    public metadataService: MetadataService,
    public userService: UserService,
    public modalService: NgbModal,
    public spinner: NgxSpinnerService,
    public linkService: LinkVendorService
  ) {
    this.navigation = this.route.getCurrentNavigation();
    this.getSearchFilterColumns();
  }

  ngOnInit() {
    this.metadataService
      .getCustomerSubscriptionTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => (this.subscriptions = v));
    this.metadataService
      .getCustomerAddons()
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => (this.addons = v));

    localStorage.removeItem('viewCustomerInfo');

    this.searchDebouncer
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe(() => this.onSearch(this.searchQuery));
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
          width: 190,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.subscriptionCell
          }
        },
        {
          headerName: 'Unlock',
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.unlockCell
          },
          hide: false,
          sortable: false,
          filter: false,
          width: 240
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
          width: 350
        },
        {
          headerName: '',
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.linkVendorCell
          },
          hide: false,
          sortable: false,
          filter: false,
          width: 240
        }
      ]
    );

    this.columnDefs.push({
      headerName: 'Test Account',
      field: 'testAccount',
      filter: false,
      width: 170,
      cellRenderer: 'templateRenderer',
      cellRendererParams: {
        ngTemplate: this.changeCustomerAccountCell
      }
    });

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
    this.userService
      .unlockUser(customer.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.onSearch();
        },
        err => {
          this.toastr.error('Unable to perform action');
        }
      );
  }

  onActivate(customer: Customer) {
    this.customerService
      .activateCustomer(customer.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.onSearch();
        },
        err => {
          this.toastr.error('Unable to perform action');
        }
      );
  }

  onDeactivate(customer: Customer) {
    this.customerService
      .deactivateCustomer(customer.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.onSearch();
        },
        err => {
          this.toastr.error('Unable to perform action');
        }
      );
  }

  onCommunicate(customer: Customer): void {
    this.store.dispatch({
      type: AppTypes.UpdateSidebarInfo,
      payload: {customer}
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

  onSearch(customerName = null) {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler');
        this.requests++;

        const isPresent = this.filterColumnsRequest.findIndex(_ => _.displayName === 'Customer Name');
        if (isPresent !== -1 && customerName !== null) {
          this.filterColumnsRequest[isPresent] = {
            ...this.filterColumnsRequest[isPresent],
            selectedOperator: 'contains',
            searchedValue: customerName
          };
        } else if (customerName !== null) {
          this.filterColumnsRequest.push({
            id: 10,
            displayName: 'Customer Name',
            selectedOperator: 'contains',
            searchedValue: customerName
          });
        }

        this.userService
          .getAllCustomers(params.startRow / this.pageSize, this.pageSize, {
            q: '',
            filterColumnsRequests: this.filterColumnsRequest
          })
          .pipe(takeUntil(this.destroy$))
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

  link(ev, row) {
    const size: any = 'xl';
    ev.stopPropagation();
    this.customerId = row.customerId;

    this.modalService.open(this.linkVendorModal, {
      windowClass: 'vendors-modal',
      centered: true,
      size
    });
  }

  subscription(ev, row) {
    console.log(row);
    ev.stopPropagation();
    this.customerId = row.customerId;
    this.userService
      .getCustomerContract(this.customerId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(e => this.handleResponseError(e))
      )
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
      this.userService.updateCustomerContract(this.contractInfo.contract.id, v.addon, v.subscription).subscribe(_ => {
        this.modalService.dismissAll();
      });
    } else {
      this.userService.setCustomerContract(this.customerId, v.addon, v.subscription).subscribe(_ => {
        this.modalService.dismissAll();
      });
    }
  }

  handleResponseError(e) {
    const message = (e.error && e.error.message) || 'Get Customer Contract occurs an error.';
    this.toastr.error(`${message} Please contact your admin`);

    return throwError('Error');
  }

  addCustomer() {
    localStorage.removeItem('procurement-RegisterCustomer');
    localStorage.removeItem('procurement-RegisterContact');
    this.route.navigateByUrl('/user-manage/add-customer');
  }

  markCustomerProfileAsTest() {
    this.spinner.show();
    this.userService
      .markCustomerProfileAsTest(this.selected.customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        this.spinner.hide();
        this.closeMarkCustomerAccountAsTestModal();
        this.onSearch();
      });
  }

  markCustomerAccountAsTest(template: TemplateRef<any>, row: any) {
    this.selected = row;
    this.modalService.open(template, {
      windowClass: 'change-account-modal',
      centered: true,
      size: 'sm'
    });
  }

  closeMarkCustomerAccountAsTestModal() {
    this.selected = null;
    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
