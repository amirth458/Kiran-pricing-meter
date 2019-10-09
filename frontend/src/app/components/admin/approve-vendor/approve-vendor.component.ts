import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from 'ag-grid-community';

import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-approve-vendor',
  templateUrl: './approve-vendor.component.html',
  styleUrls: ['./approve-vendor.component.css']
})
export class ApproveVendorComponent implements OnInit {

  @ViewChild('modal') modal;
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
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [{
    headerName: 'Vendor Name',
    field: 'vendorName',
    hide: false,
    sortable: true,
    filter: false
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
    filter: false
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
      } catch (e) {

      }
      return country;
    },
  },
  {
    headerName: 'Confidentiality',
    field: 'confidentiality',
    hide: false,
    sortable: true,
    filter: false,
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
    width: 100,
    cellRenderer: 'actionCellRenderer',
    cellRendererParams: {
      action: {
        edit: (param) => this.editRow(param),
        delete: async (param) => {
          this.modal.nativeElement.click();
          this.selectedFacility = param.data;
        },
        canEdit: true,
        canCopy: false,
        canDelete: true,
      }
    }
  }
  ];

  gridOptions: GridOptions;
  rowData = [];
  pageSize = 10;
  vendor: Observable<Vendor>;
  sub: Subscription;
  vendorId = 0;
  navigation;

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
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: (event) => {
        // this.onRowClick(event);
      }

    };
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
      // if (this.navigation && this.navigation.extras.state && this.navigation.extras.state.toast) {
      //   const toastInfo = this.navigation.extras.state.toast;
      //   if (toastInfo.type === 'success') {
      //     this.toastr.success(toastInfo.body);
      //   } else {
      //     this.toastr.error(toastInfo.body);
      //   }
      // }
    }, 50);
  }

  async getAllUsers() {
    this.spineer.show();
    try {
      this.rowData = await this.userService.getAllUsers().toPromise();
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

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }


  async declineUser() {
    this.spineer.show();
    try {
      // await this.userService.declineUser(this.selectedUser.id).toPromise();
      this.toastr.success(this.selectedFacility.name + ' deleted.');
    } catch (e) {
      this.toastr.error('We are sorry, ' + this.selectedFacility.name + ' delete failed. Please try again later.');
    } finally {
      this.spineer.hide();
    }
    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedFacility.id);
    this.rowData = filteredData;
    this.modal.nativeElement.click();

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
