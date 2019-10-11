import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from 'ag-grid-community';

import { ActionCellApproveRendererComponent } from 'src/app/common/action-cell-approve-renderer/action-cell-approve-renderer.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { DropdownHeaderRendererComponent } from 'src/app/common/dropdown-header-renderer/dropdown-header-renderer.component';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-approve-vendor',
  templateUrl: './approve-vendor.component.html',
  styleUrls: ['./approve-vendor.component.css']
})
export class ApproveVendorComponent implements OnInit {

  @ViewChild('infoModal') infoModal;
  selectedFacility = null;


  searchColumns = [{
    name: 'Vendor Name',
    checked: false,
    field: 'vendorName',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Company Name',
    checked: false,
    field: 'companyName',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Email Address',
    checked: false,
    field: 'email',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Country',
    checked: false,
    field: 'country',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Confidentiality',
    checked: false,
    field: 'confidentiality',
    query: {
      type: '',
      filter: '',
    }
  },
  ];
  filterColumns = [{
    name: 'Vendor Name',
    checked: true,
    field: 'vendorName'
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
  },
  {
    name: 'Confidentiality',
    checked: true,
    field: 'confidentiality'
  },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellApproveRendererComponent,
    headerRenderer: DropdownHeaderRendererComponent,
  };

  columnDefs = [{
    headerName: '',
    headerComponentFramework: DropdownHeaderRendererComponent,
    field: 'chooseall',
    headerCheckboxSelection: true,
    checkboxSelection: true,
    hide: false,
    sortable: false,
    filter: false,
    width: 80,
    headerRendererParams: {
      action: {
        dropdown: (param) => {
          event.stopPropagation();
          this.showTypeDropDown = !this.showTypeDropDown;
          console.log(this.showTypeDropDown);
        },
      }
    }
  },
  {
    headerName: 'Vendor Name',
    field: 'vendorName',
    hide: false,
    sortable: true,
    filter: false,
    cellRenderer(params) {
      let vendorName = '';
      try {
        vendorName = params.data.vendor.name;
      } catch (e) {

      }
      return vendorName;
    },
  },
  {
    headerName: 'Company Name',
    field: 'companyName',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Email Address',
    field: 'email',
    hide: false,
    sortable: true,
    filter: false,
    cellRenderer(params) {
      let email = '';
      try {
        email = params.data.vendor.email;
      } catch (e) {

      }
      return email;
    },
  },
  {
    headerName: 'Country',
    field: 'country',
    hide: true,
    sortable: true,
    filter: false,
    cellRenderer(params) {
      let country = '';
      try {
        country = params.data.vendor.country.name;
      } catch (e) { }
      return country;
    },
  },
  {
    headerName: 'Confidentiality',
    field: 'confidentiality',
    hide: false,
    sortable: true,
    filter: false,
    width: 120,
    cellRenderer(params) {
      let confidentiality = '';
      try {
        confidentiality = params.data.vendor.confidentiality.name;
      } catch (e) {

      }
      return confidentiality;
    },
  },
  {
    headerName: 'Actions',
    filter: false,
    width: 150,
    cellRenderer: 'actionCellRenderer',
    cellRendererParams: {
      action: {
        approve: (param) => {
          if (param.data.vendor) {
            this.approveUser(param.data.vendor.id);
          }
        },
        decline: async (param) => {
          if (param.data.vendor) {
            this.declineUser(param.data.vendor.id);
          }
        },
        canEdit: false,
        canCopy: false,
        canDelete: false,
        canApprove: (param) => {
          if (param.data.vendor) {
            if ( param.data.vendor.approvedAt !== null) {
              return false;
            }
            return true;
          }
          return false;
        },
        canDecline: (param) => {
          if (param.data.vendor) {
            if ( param.data.vendor.approvedAt !== null) {
              return false;
            }
            return true;
          }
          return false;
        },
      }
    }
  }];

  gridOptions: GridOptions;
  allUsers = [];
  rowData = [];
  pageSize = 10;
  vendor: Observable<Vendor>;
  sub: Subscription;
  vendorStatus = 1;
  navigation;
  infoText = '';
  showTypeDropDown = false;
  constructor(
    private route: Router,
    private userService: UserService,
    private spineer: NgxSpinnerService,
    private store: Store<any>,
    private toastr: ToastrService,
  ) {
    // this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {
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
      rowHeight: 50,
      headerHeight: 35,
      rowSelection: 'multiple',

      onRowClicked: (event) => {
        // this.onRowClick(event);
      },
      onCellDoubleClicked: (param) => {
        const userId = param.data.id;
        this.route.navigateByUrl(`/admin/vendor-details/${userId}/user`);
      },
      rowClassRules: {
        'non-approved': (params) => {
          if ( params.data.vendor ) {
            return !params.data.vendor.approved && params.data.vendor.approvedAt === null;
          }
          return false;
        },
        approved: (params) => {
          if ( params.data.vendor ) {
            return params.data.vendor.approved;
          }
          return false;
        },
        declined: (params) => {
          if ( params.data.vendor ) {
            return !params.data.vendor.approved && params.data.vendor.approvedAt !== null;
          }
          return false;
        }
      }
    };
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
    }, 50);
  }

  @HostListener('document:click')
  clickout() {
    this.showTypeDropDown = false;
  }
  async getAllUsers() {
    this.spineer.show();
    try {
      this.allUsers = await this.userService.getAllUsers().toPromise();
      this.vendorStatusChanged(this.vendorStatus);
    } catch (e) {
      this.spineer.hide();
      console.log(e);
    } finally {
      this.spineer.hide();
    }
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

  vendorStatusChanged(value) {
    this.showTypeDropDown = false;
    const status = Number(value);
    this.vendorStatus = status;
    if (status === 0) {
      this.rowData = this.allUsers;
    } else if (status === 1) {
      // Not approved
      this.rowData = this.allUsers.filter(user => {
        let flag = false;
        if ( user.vendor) {
          flag = !user.vendor.approved && user.vendor.approvedAt === null;
        }
        return  flag;
      });
    } else if (status === 2) {
      // Approved
      this.rowData = this.allUsers.filter(user => {
        let flag = false;
        if ( user.vendor) {
          flag = user.vendor.approved;
        }
        return  flag;
      });
    } else if (status === 3) {
      // Declined
      this.rowData = this.allUsers.filter(user => {
        let flag = false;
        if ( user.vendor) {
          flag = !user.vendor.approved && user.vendor.approvedAt !== null;
        }
        return flag;
      });
    }
  }

  async approveUsers(event) {
    const data = this.gridOptions.api.getSelectedNodes();
    let userIds = data.map(node => {
      if (node.data.vendor) {
        return node.data.vendor.id;
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
        await this.getAllUsers();
        this.vendorStatusChanged(this.vendorStatus);
        this.toastr.success('Vendors are approved.');
      } catch (e) {
        this.toastr.error('We are sorry, Vendors are not approved with some error. Please try again later.');
      } finally {
        this.spineer.hide();
      }
    }
  }

  async declineUsers(event) {
    const data = this.gridOptions.api.getSelectedNodes();
    let userIds = data.map(node => {
      if (node.data.vendor) {
        return node.data.vendor.id;
      } else {
        return null;
      }
    });
    userIds = userIds.filter(id => id !== null);
    if (userIds.length === 0) {
      this.infoText = 'decline';
      this.infoModal.nativeElement.click();
    } else {
      try {
        this.spineer.show();
        await this.userService.declineUsers(userIds).toPromise();
        await this.getAllUsers();
        this.vendorStatusChanged(this.vendorStatus);
        this.toastr.success('Vendors are declined.');
      } catch (e) {
        this.toastr.error('We are sorry, Vendors are not declined with some error. Please try again later.');
      } finally {
        this.spineer.hide();
      }
    }
  }

  async declineUser(id) {
    this.spineer.show();
    try {
      await this.userService.declineUser(id).toPromise();
      await this.getAllUsers();
      this.vendorStatusChanged(this.vendorStatus);
      this.toastr.success('Vendor is decliend.');
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
      await this.getAllUsers();
      this.vendorStatusChanged(this.vendorStatus);
      this.toastr.success('Vendor is approved.');
    } catch (e) {
      this.toastr.error('We are sorry, Vendor is not approved. Please try again later.');
    } finally {
      this.spineer.hide();
    }
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
