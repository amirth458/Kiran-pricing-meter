import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  Router
} from '@angular/router';

import {
  GridOptions
} from 'ag-grid-community';

import {
  ActionCellRendererComponent
} from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import {
  FacilityService
} from '../../service/facility.service';
import {
  UserService
} from '../../service/user.service';

import {
  NgxSpinnerService
} from 'ngx-spinner';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.css']
})
export class FacilityComponent implements OnInit {

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
      field: 'vendorFacilityCertificationList',
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
      field: 'vendorFacilityCertificationList'
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
      filter: true
    },
    {
      headerName: 'Facility Name',
      field: 'name',
      hide: false,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Email',
      field: 'email',
      hide: false,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Phone',
      field: 'phone',
      hide: true,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Address',
      field: 'address',
      hide: false,
      sortable: true,
      filter: true,
      cellRenderer(params) {
        return params.data.street1 + ' ' + params.data.street2;
      }
    },
    {
      headerName: 'City',
      field: 'city',
      hide: false,
      sortable: true,
      filter: true
    },
    {
      headerName: 'State',
      field: 'state',
      hide: false,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Country',
      field: 'country',
      hide: false,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Certifications',
      field: '[vendorFacilityCertificationList].length',
      hide: false,
      sortable: true,
      filter: true,
      cellRenderer(params) {
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
  rowData;
  pageSize = 10;

  constructor(
    public route: Router,
    public facilityService: FacilityService,
    public userService: UserService,
    public spineer: NgxSpinnerService
  ) {}

  ngOnInit() {

    this.getVendorFacilities();
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
          this.userService.getUserInfo().id, {
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
      await this.facilityService.deleteFacility(this.userService.getUserInfo().id, this.selectedFacility.id).toPromise();
    } catch (e) {
      console.log(e);
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
