import { Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ColDef, GridOptions } from 'ag-grid-community';

import { ActionCellApproveRendererComponent } from 'src/app/common/action-cell-approve-renderer/action-cell-approve-renderer.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { DropdownHeaderRendererComponent } from 'src/app/common/dropdown-header-renderer/dropdown-header-renderer.component';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataService } from 'src/app/service/metadata.service';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';
import { LinkVendorService } from 'src/app/service/link-vendor.service';
import { Util } from '../../../util/Util';

@Component({
  selector: 'app-approve-vendor',
  templateUrl: './approve-vendor.component.html',
  styleUrls: ['./approve-vendor.component.css']
})
export class ApproveVendorComponent implements OnInit, OnDestroy {
  @Input() inModal = false;
  @Input() customerId = null;

  @ViewChild('infoModal') infoModal;
  @ViewChild('declineModal') declineModal;
  @ViewChild('subscriptionCell') subscriptionCell;
  @ViewChild('subscriptionModal') subscriptionModal;
  @ViewChild('authenticationModal') authenticationModal;
  @ViewChild('changeVendorAccountCell') changeVendorAccountCell;
  @ViewChild('unlockCell') unlockCell;

  subscriptions = [];
  addons = [];
  contractInfo;
  vendorId;
  totalcounts;
  userInfo;

  selectedFacility = null;

  searchColumns = [];
  filterColumns = [];
  columnDefs: ColDef[] = [];
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
  selected: any;
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

  searchQuery: string;
  destroy$: Subject<boolean> = new Subject();
  searchDebouncer: Subject<any> = new Subject<any>();
  selectedItems = [];

  constructor(
    public route: Router,
    public userService: UserService,
    public spineer: NgxSpinnerService,
    public metadataService: MetadataService,
    public toastr: ToastrService,
    public modalService: NgbModal,
    public spinner: NgxSpinnerService,
    public linkService: LinkVendorService
  ) {
    this.selected = null;
    this.navigation = this.route.getCurrentNavigation();
    this.getSearchFilterColumns();
  }

  ngOnInit() {
    this.metadataService
      .getVendorSubscriptionTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => (this.subscriptions = v));
    this.metadataService
      .getVendorAddons()
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => (this.addons = v));
    this.searchDebouncer
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe(() => this.onSearch(this.searchQuery));
    if (this.inModal) {
      this.getCustomerLinks();
    }
  }

  get getSelection() {
    return this.selectedItems;
  }

  async getSearchFilterColumns() {
    const columns = await this.userService.getFilterColumns().toPromise();

    this.filterColumns = columns.map(column => ({
      name: column.displayName === 'Vendor Status' ? 'Approval Status' : column.displayName,
      checked: true,
      field: column.displayName
    }));

    this.searchColumns = columns
      .map(column => {
        return {
          id: column.id,
          name: column.displayName === 'Vendor Status' ? 'Approval Status' : column.displayName,
          checked: false,
          operators: column.operators,
          field: column.displayName,
          query: {type: '', filter: null}
        };
      })
      .filter(_ => !(this.inModal && _.name === 'Approval Status'));

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

    if (!this.inModal) {
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
        width: 550,
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
            view: param => {
              if (param.data && param.data.user && param.data.user.id) {
                const userId = param.data.user.id;
                this.route.navigateByUrl(`/user-manage/vendor-details/${userId}/user`);
              }
            },
            edit: param => {
              this.userInfo = param.data.user;
              const alreadyAuthenticated = Util.isUserAuthenticated();
              if (!alreadyAuthenticated) {
                this.modalService.open(this.authenticationModal, {
                  windowClass: 'authentication-modal',
                  centered: true,
                  size: 'lg'
                });
              } else {
                this.route.navigateByUrl(`/user-manage/vendor-details/${this.userInfo.id}/user`);
              }
            },
            canEdit: true,
            canCopy: false,
            canDelete: false,
            canApprove: param => {
              if (param.data) {
                if (param.data.approved === false || param.data.approvedAt === null) {
                  return true;
                }
              }
              return false;
            },
            canDecline: param => {
              if (param.data) {
                if (param.data.approved === true) {
                  return true;
                }
                return false;
              }
              return false;
            }
          }
        }
      });

      this.columnDefs.push({
        headerName: 'Unlock',
        filter: false,
        width: 120,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.unlockCell
        }
      });

      this.columnDefs.push({
        headerName: 'Test Account',
        field: 'testAccount',
        filter: false,
        width: 170,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.changeVendorAccountCell
        }
      });
    }

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
      onCellDoubleClicked: param => {
        if (!this.inModal) {
          const userId = param.data.user.id;
          this.route.navigateByUrl(`/user-manage/vendor-details/${userId}/user`);
        }
      },

      onRowSelected: event => {
        if (this.gridOptions && this.gridOptions.api && event.node.isSelected()) {
          if (this.selectedItems.filter(_ => _.node.data.id === event.node.data.id).length === 0) {
            this.selectedItems.push({
              label: event.node.data.name,
              node: event.node
            });
          }
        } else {
          this.selectedItems = this.selectedItems.filter(
            item => !item.node.data || item.node.data.id !== event.node.data.id
          );
        }
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

  onUnlock(vendor) {
    this.userService
      .unlockUser(vendor.user.id)
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
      this.modalService.open(this.declineModal, {
        centered: true
      });
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
      this.modalService.dismissAll();
    } catch (e) {
      this.toastr.error('We are sorry, Vendors are not declined with some error. Please try again later.');
      this.modalService.dismissAll();
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
      this.searchColumnsChange();
    }
  }

  onSearch(vendorName = null) {
    const dataSource = {
      rowCount: 0,
      getRows: params => {
        const isPresent = this.filterColumnsRequest.findIndex(_ => _.displayName === 'Vendor Name');
        if (isPresent !== -1 && vendorName !== null) {
          this.filterColumnsRequest[isPresent] = {
            ...this.filterColumnsRequest[isPresent],
            selectedOperator: 'contains',
            searchedValue: vendorName
          };
        } else if (vendorName !== null) {
          this.filterColumnsRequest.push({
            id: 2,
            displayName: 'Vendor Name',
            selectedOperator: 'contains',
            searchedValue: vendorName
          });
        }

        this.spinner.show('spooler');
        this.userService
          .getAllUsers(params.startRow / this.pageSize, this.pageSize, {
            q: this.searchQuery,
            filterColumnsRequests: this.inModal
              ? [
                ...this.filterColumnsRequest,
                {
                  id: 8,
                  displayName: 'Approval Status',
                  selectedOperator: '=',
                  searchedValue: 'true'
                }
              ]
              : this.filterColumnsRequest
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.spinner.hide('spooler');
            const rowsThisPage = data.content || [];

            const lastRow = data.total <= params.endRow ? data.total : -1;
            this.totalcounts = data.total;
            params.successCallback(rowsThisPage, lastRow);

            this.refreshSelection();

            // this.reconfigColumns();
          });
      }
    };
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setDatasource(dataSource);
    }
  }

  refreshSelection() {
    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.forEachNode(i => {
        const loc = this.selectedItems.findIndex(_ => _.node.data.id === i.data.id);
        if (loc !== -1) {
          i.setSelected(true);
          this.selectedItems[loc] = {
            label: i.data.name,
            node: i
          };
        } else {
          i.setSelected(false);
        }
        return i;
      });
    }
  }

  subscription(ev, row) {
    ev.stopPropagation();
    this.vendorId = row.id;
    this.userService
      .getVendorContract(row.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(e => this.handleResponseError(e))
      )
      .subscribe(v => {
        this.contractInfo = v;

        this.modalService.open(this.subscriptionModal, {
          centered: true,
          size: 'lg'
        });
      });
  }

  markVendorProfileAsTest() {
    this.spinner.show();
    this.userService
      .markVendorProfileAsTest(this.selected.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        this.spinner.hide();
        this.closeMarkVendorAccountAsTestModal();
        this.onSearch();
      });
  }

  markVendorAccountAsTest(template: TemplateRef<any>, row: any) {
    this.selected = row;
    this.modalService.open(template, {
      windowClass: 'change-account-modal',
      centered: true,
      size: 'sm'
    });
  }

  closeMarkVendorAccountAsTestModal() {
    this.selected = null;
    this.modalService.dismissAll();
  }

  setSubscription(v) {
    if (this.contractInfo) {
      this.userService.updateVendorContract(this.contractInfo.contract.id, v.addon, v.subscription).subscribe(_ => {
        this.modalService.dismissAll();
      });
    } else {
      this.userService.setVendorContract(this.vendorId, v.addon, v.subscription).subscribe(_ => {
        this.modalService.dismissAll();
      });
    }
  }

  handleResponseError(e, generic = false) {
    const message = e.error.message || 'Get Vendor Contract occurs an error.';
    if (!generic) {
      this.toastr.error(`${message} Please try again.`);
    } else {
      this.toastr.error(`Error while perfoming action. Please try again.`);
    }

    return throwError('Error');
  }

  addVendor() {
    this.userService.setVendorRegisterUserInfo(null);
    this.userService.setVendorRegisterVendorInfo(null);
    this.userService.setVendorRegisterMachineInfo(null);
    this.route.navigateByUrl('/user-manage/add-vendor');
  }

  clearSelection() {
    this.selectedItems = [];
    this.gridOptions.api.deselectAll();
    this.gridOptions.api.refreshHeader();
  }

  removeItem(ev: any) {
    this.selectedItems = this.selectedItems.filter(item => item.node.data.id !== ev.data.id);
    this.refreshSelection();
  }

  linkVendor() {
    this.spineer.show();
    this.linkService
      .linkVendor(this.customerId, [...this.selectedItems.map(_ => _.node.data.id)])
      .pipe(
        takeUntil(this.destroy$),
        catchError(e => this.handleResponseError(e, true))
      )
      .subscribe(res => {
        this.modalService.dismissAll();
        this.toastr.success('Successfully linked with vendors');
        this.spineer.hide();
      });
  }

  closeLinkModal() {
    this.modalService.dismissAll();
  }

  getCustomerLinks() {
    this.linkService
      .getLink(this.customerId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(e => this.handleResponseError(e, true))
      )
      .subscribe(res => {
        this.selectedItems = (res.vendorProfiles || []).map(i => {
          return {
            label: i.name,
            node: {
              data: i
            }
          };
        });
        this.refreshSelection();
      });
  }

  authenticateUser(v) {
    this.modalService.dismissAll();
    if (v.authenticated) {
      const userId = v.userInfo.id;
      // 1 Hour expiry time
      const expiryTime = new Date().getTime() + 3600 * 1000;
      localStorage.setItem('admin-userAuthenticated', JSON.stringify({authenticated: true, expiryTime}));
      this.route.navigateByUrl(`/user-manage/vendor-details/${userId}/user`);
    } else if (!v.cancelled) {
      this.toastr.error('Wrong Email OR Key entered.');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
