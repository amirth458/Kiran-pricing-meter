import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from 'ag-grid-community';

import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { FacilityService } from '../../../service/facility.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approve-vendor',
  templateUrl: './approve-vendor.component.html',
  styleUrls: ['./approve-vendor.component.css']
})
export class ApproveVendorComponent implements OnInit {

  @ViewChild('modal') modal;
  selectedFacility = null;


  searchColumns = [{
    name: 'Facility No',
    checked: false,
    field: 'id',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Facility Name',
    checked: false,
    field: 'name',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Email',
    checked: false,
    field: 'email',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Phone',
    checked: false,
    field: 'phone',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Address',
    checked: false,
    field: 'address',
    query: {
      type: '',
      filter: '',
    }
  },

  {
    name: 'City',
    checked: false,
    field: 'city',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'State',
    checked: false,
    field: 'state',
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
    name: 'Certifications',
    checked: false,
    field: 'certifications',
    query: {
      type: '',
      filter: '',
    }
  },
  {
    name: 'Actions',
    checked: false,
    field: 'actions',
    query: {
      type: '',
      filter: '',
    }
  },
  ];
  filterColumns = [{
    name: 'Facility No',
    checked: true,
    field: 'id'
  },
  {
    name: 'Facility Name',
    checked: true,
    field: 'name'
  },
  {
    name: 'Email',
    checked: true,
    field: 'email'
  },
  {
    name: 'Phone',
    checked: false,
    field: 'phone'
  },
  {
    name: 'Address',
    checked: false,
    field: 'address'
  },

  {
    name: 'City',
    checked: true,
    field: 'city'
  },
  {
    name: 'State',
    checked: true,
    field: 'state'
  },
  {
    name: 'Country',
    checked: false,
    field: 'country'
  },
  {
    name: 'Certifications',
    checked: true,
    field: 'certifications'
  },
  {
    name: 'Actions',
    checked: true,
    field: 'actions'
  },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [{
    headerName: 'Facility No',
    field: 'id',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Facility Name',
    field: 'name',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Email',
    field: 'email',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Phone',
    field: 'phone',
    hide: true,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Address',
    field: 'address',
    hide: false,
    sortable: true,
    filter: false,
    cellRenderer(params) {
      return params.data.street1 + ' ' + params.data.street2;
    },
    valueGetter: (params) => {
      return params.data.street1 + ' ' + params.data.street2;
    }
  },
  {
    headerName: 'City',
    field: 'city',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'State',
    field: 'state',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Country',
    field: 'country',
    hide: false,
    sortable: true,
    filter: false
  },
  {
    headerName: 'Certifications',
    field: 'certifications',
    hide: false,
    sortable: true,
    filter: false,
    cellRenderer(params) {
      return params.data.vendorFacilityCertificationList.map(x => x.facilityCertification.name).join(', ');
    },
    valueGetter: (params) => {
      return params.data.vendorFacilityCertificationList.map(x => x.facilityCertification.name).join(', ');
    }
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
    private facilityService: FacilityService,
    private spineer: NgxSpinnerService,
    private store: Store<any>,
    private toastr: ToastrService,
  ) {
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {
    this.sub = this.vendor.subscribe(res => {
      if (res) {
        this.vendorId = Number(res.id);
      } else {
        this.vendorId = 0;
      }
      this.getVendorFacilities();
    });

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
      if (this.navigation && this.navigation.extras.state && this.navigation.extras.state.toast) {
        const toastInfo = this.navigation.extras.state.toast;
        if (toastInfo.type === 'success') {
          this.toastr.success(toastInfo.body);
        } else {
          this.toastr.error(toastInfo.body);
        }
      }
    }, 50);
  }

  async getVendorFacilities() {
    this.spineer.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        // tslint:disable-next-line:max-line-length
        const res = await this.facilityService.getFacilities(
          this.vendorId, {
          page,
          size: 1000,
          sort: 'id,DESC',
          q: ''
        }
        ).toPromise();
        rows.push(...res.content);
        if (!res.content) {
          break;
        }
        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;

      }
      this.rowData = rows;
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


  async deleteFacility() {
    this.spineer.show();
    try {
      await this.facilityService.deleteFacility(this.vendorId, this.selectedFacility.id).toPromise();
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
