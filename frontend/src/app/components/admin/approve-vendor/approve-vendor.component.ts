import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from 'ag-grid-community';

import { ActionCellApproveRendererComponent } from 'src/app/common/action-cell-approve-renderer/action-cell-approve-renderer.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription, combineLatest, throwError } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { DropdownHeaderRendererComponent } from 'src/app/common/dropdown-header-renderer/dropdown-header-renderer.component';
import { ThrowStmt } from '@angular/compiler';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataService } from 'src/app/service/metadata.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-approve-vendor',
  templateUrl: './approve-vendor.component.html',
  styleUrls: ['./approve-vendor.component.css']
})
export class ApproveVendorComponent implements OnInit {
  @ViewChild('infoModal') infoModal;
  @ViewChild('modal') modal;
  @ViewChild('subscriptionCell') subscriptionCell;
  @ViewChild('subscriptionModal') subscriptionModal;

  subscriptions = [];
  addons = [];
  contractInfo;
  vendorId;
  totalcounts;

  selectedFacility = null;

  searchColumns = [];
  filterColumns = [];
  columnDefs = [];
  filterColumnsRequest = [];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellApproveRendererComponent,
    headerRenderer: DropdownHeaderRendererComponent,
    templateRenderer: TemplateRendererComponent
  };

  gridOptions: GridOptions;
  allUsers = [];
  rowData = [];
  pageSize = 50;
  vendor: Observable<Vendor>;
  sub: Subscription;
  vendorStatus = 1;
  selectedUserIds = [];
  navigation;
  infoText = '';
  showTypeDropDown = false;
  declineComments = '';
  primaryContactName = '';

  matchingNames = {
    'Vendor ID': 'id',
    'Vendor Name': 'name',
    'Email Address': 'email',
    Country: 'country.name',
    Confidentiality: 'confidentiality.name',
    'Approved On': 'approvedAt',
    'Last Login Attempt': 'user.lastLoginAttempt',
    'Vendor Status': 'approved'
  };

  constructor(
    private route: Router,
    private userService: UserService,
    private spineer: NgxSpinnerService,
    private metadataService: MetadataService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {
    this.navigation = this.route.getCurrentNavigation();
    this.getSearchFilterColumns();
  }

  ngOnInit() {
    this.metadataService.getVendorSubscriptionTypes().subscribe(v => (this.subscriptions = v));
    this.metadataService.getVendorAddons().subscribe(v => (this.addons = v));
  }

  async getSearchFilterColumns() {
    const columns = await this.userService.getFilterColumns().toPromise();

    this.filterColumns = columns.map(column => ({
      name: column.displayName === 'Vendor Status' ? 'Approval Status' : column.displayName,
      checked: true,
      field: column.displayName
    }));

    this.searchColumns = columns.map(column => ({
      id: column.id,
      name: column.displayName === 'Vendor Status' ? 'Approval Status' : column.displayName,
      checked: false,
      operators: column.operators,
      field: column.displayName,
      query: { type: '', filter: null }
    }));

    this.columnDefs = [
      {
        headerName: '',
        field: 'chooseall',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        hide: false,
        sortable: false,
        filter: false,
        width: 80
      }
    ];

    this.columnDefs.push(
      ...columns.map(column => ({
        headerName: column.displayName === 'Vendor Status' ? 'Approval Status' : column.displayName,
        field: this.matchingNames[column.displayName],
        hide: true,
        sortable: false,
        filter: false,
        tooltipField: this.matchingNames[column.displayName],
        headerTooltip: column.displayName
      }))
    );

    this.columnDefs.push({
      headerName: 'Subscription',
      filter: false,
      width: 170,
      cellRenderer: 'templateRenderer',
      cellRendererParams: {
        ngTemplate: this.subscriptionCell
      }
    });

    this.columnDefs.push({
      headerName: 'Actions',
      filter: false,
      width: 170,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          approve: param => {
            if (param.data) {
              this.approveUser(param.data.id);
            }
          },
          decline: async param => {
            if (param.data) {
              this.declineUser(param.data.id);
            }
          },
          canEdit: false,
          canCopy: false,
          canDelete: false,
          canApprove: param => {
            if (param.data) {
              if (param.data.approvedAt !== null) {
                return false;
              }
              return true;
            }
            return false;
          },
          canDecline: param => {
            if (param.data) {
              if (param.data.approvedAt !== null) {
                return false;
              }
              return true;
            }
            return false;
          }
        }
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
      rowHeight: 30,
      headerHeight: 35,
      rowSelection: 'multiple',

      onRowClicked: event => {
        // this.onRowClick(event);
      },
      onCellDoubleClicked: param => {
        const userId = param.data.user.id;
        this.route.navigateByUrl(`/user-manage/vendor-details/${userId}/user`);
      },
      rowClassRules: {
        'non-approved': params => {
          if (params.data) {
            return !params.data.approved && params.data.approvedAt === null;
          }
          return false;
        },
        approved: params => {
          if (params.data) {
            return params.data.approved;
          }
          return false;
        },
        declined: params => {
          if (params.data) {
            return !params.data.approved && params.data.approvedAt !== null;
          }
          return false;
        }
      }
    };
  }

  @HostListener('document:click')
  clickout() {
    this.showTypeDropDown = false;
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

  vendorStatusChanged(value) {
    this.showTypeDropDown = false;
  }

  async approveUsers(event) {
    const data = this.gridOptions.api.getSelectedNodes();
    let userIds = data.map(node => {
      if (node.data) {
        return node.data.id;
      } else {
        return null;
      }
    });
    userIds = userIds.filter(id => id !== null);
    if (userIds.length === 0) {
      this.infoText = 'approve';
      this.infoModal.nativeElement.click();
    } else {
      try {
        this.spineer.show();
        await this.userService.approveUsers(userIds).toPromise();
        this.toastr.success('Vendors are approved.');
        this.onSearch();
      } catch (e) {
        this.toastr.error('We are sorry, Vendors are not approved with some error. Please try again later.');
      } finally {
        this.spineer.hide();
      }
    }
  }

  onDeclineUsers(event) {
    const data = this.gridOptions.api.getSelectedNodes();
    const name = [];
    let userIds = data.map(node => {
      if (node.data) {
        name.push(`${node.data.primaryContactFirstName} ${node.data.primaryContactLastName}`);
        return node.data.id;
      } else {
        return null;
      }
    });
    userIds = userIds.filter(id => id !== null);
    if (userIds.length === 0) {
      this.infoText = 'decline';
      this.infoModal.nativeElement.click();
    } else {
      this.selectedUserIds = userIds;
      this.primaryContactName = name.join(', ');
      this.modal.nativeElement.click();
    }
  }

  async declineUsers(event) {
    if (this.declineComments === '') {
      return;
    }
    try {
      this.spineer.show();
      await this.userService.declineUsers(this.selectedUserIds, this.declineComments).toPromise();
      this.toastr.success('Vendors are declined.');
      this.onSearch();
      this.modal.nativeElement.click();
    } catch (e) {
      this.toastr.error('We are sorry, Vendors are not declined with some error. Please try again later.');
      this.modal.nativeElement.click();
    } finally {
      this.spineer.hide();
    }
  }

  async declineUser(id) {
    this.spineer.show();
    try {
      await this.userService.declineUser(id).toPromise();
      this.toastr.success('Vendor is decliend.');
      this.onSearch();
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not declined. Please try again later.');
    } finally {
      this.spineer.hide();
    }
  }

  async approveUser(id) {
    this.spineer.show();
    try {
      await this.userService.approveUser(id).toPromise();
      this.toastr.success('Vendor is approved.');
      this.onSearch();
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not approved. Please try again later.');
    } finally {
      this.spineer.hide();
    }
  }

  searchColumnsChange() {
    this.filterColumnsRequest = [];
    this.searchColumns.map(column => {
      if (column.checked && column.query.type) {
        this.filterColumnsRequest.push({
          id: column.id,
          displayName: column.name === 'Approval Status' ? 'Vendor Status' : column.name,
          selectedOperator: column.query.type,
          searchedValue: column.query.filter
        });
      }
    });
    this.onSearch();
  }

  reconfigColumns() {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  filterColumnsChange() {
    this.reconfigColumns();
    this.searchColumnsChange();
  }

  onGridReady(ev) {
    if (this.gridOptions) {
      this.gridOptions.api = ev.api;
      this.gridOptions.api.sizeColumnsToFit();
      this.onSearch();
    }
  }

  onSearch() {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        this.spinner.show('spooler');
        this.userService
          .getAllUsers(params.startRow / this.pageSize, this.pageSize, {
            q: '',
            filterColumnsRequests: this.filterColumnsRequest
          })
          .subscribe(data => {
            this.spinner.hide('spooler');
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

  subscription(ev, row) {
    ev.stopPropagation();
    this.vendorId = row.id;
    this.userService
      .getVendorContract(row.id)
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
      this.userService.updateVendorContract(this.contractInfo.contract.id, v.addon, v.subscription).subscribe(v => {
        this.modalService.dismissAll();
      });
    } else {
      this.userService.setVendorContract(this.vendorId, v.addon, v.subscription).subscribe(v => {
        this.modalService.dismissAll();
      });
    }
  }

  handleResponseError(e) {
    const message = e.error.message || 'Get Vendor Contract occurs an error.';
    this.toastr.error(`${message} Please contact your admin`);

    return throwError('Error');
  }
}
