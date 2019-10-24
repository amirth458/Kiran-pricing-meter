import { Component, OnInit, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { MachineService } from 'src/app/service/machine.service';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css']
})
export class MachinesComponent implements OnInit {

  @ViewChild('modal') modal;
  selectedMachine = null;


  searchColumns = [
    {
      name: 'Machine No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Machine Name', checked: false,
      field: 'name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Facility', checked: false,
      field: 'vendorFacility.name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Equipment', checked: false,
      field: 'equipment.name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Serial Number', checked: false,
      field: 'serialNumber', query: {
        type: '',
        filter: '',
      }
    },

    {
      name: 'Material', checked: false,
      field: 'machineServingMaterialList', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Actions', checked: false,
      field: 'actions', query: {
        type: '',
        filter: '',
      }
    },
  ];
  filterColumns = [
    {
      name: 'Machine No', checked: true, field: 'id'
    },
    {
      name: 'Machine Name', checked: true, field: 'name'
    },
    {
      name: 'Facility', checked: true, field: 'vendorFacility.name'
    },
    {
      name: 'Equipment', checked: true, field: 'equipment.name'
    },
    {
      name: 'Serial Number', checked: true, field: 'serialNumber'
    },

    {
      name: 'Material', checked: true, field: 'machineServingMaterialList'
    },
    {
      name: 'Actions', checked: true, field: 'actions'
    },
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs = [
    { headerName: 'Machine No', field: 'id', hide: false, sortable: true, filter: false, width: 120 },
    { headerName: 'Machine Name', field: 'name', hide: false, sortable: true, filter: false },
    { headerName: 'Facility', field: 'vendorFacility.name', hide: false, sortable: true, filter: false },
    {
      headerName: 'Equipment', field: 'equipment.name', hide: false, sortable: true, filter: false
    },
    {
      headerName: 'Material', field: 'machineServingMaterialList', hide: false, sortable: true, filter: false,
      cellRenderer(params) {
        const data = params.data;
        let materials = '';
        data.machineServingMaterialList.map((x, index) => {
          if (index === 0) {
            materials = x.material.name;
          } else {
            materials = materials + ',' + x.material.name;
          }
        });
        return `
        <div>
        <a href="#" data-toggle="tooltip" title="${materials}">${materials}</a>

        <div class="tooltip bs-tooltip-top" role="tooltip">
          <div class="arrow"></div>
          <div class="tooltip-inner">
            ${materials}
          </div>
        </div>
        </div>`;
      },
      valueGetter: (params) => {
        const data = params.data;
        let materials = '';
        data.machineServingMaterialList.map((x, index) => {
          if (index === 0) {
            materials = x.material.name;
          } else {
            materials = materials + ',' + x.material.name;
          }
        });
        return materials;
      }
    },
    { headerName: 'Serial Number', field: 'serialNumber', hide: false, sortable: true, filter: false },
    {
      headerName: 'Actions',
      width: 100,
      pinned: 'right',
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          delete: async (param) => {
            this.modal.nativeElement.click();
            this.selectedMachine = param.data;
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
  navigation;

  constructor(
    public route: Router,
    public machineService: MachineService,
    public userService: UserService,
    public spineer: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }

  ngOnInit() {

    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });

    this.getMachinery();
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

  async getMachinery() {
    this.spineer.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'id,ASC', page, q: '' };
        const res = await this.machineService.getMachinery(this.userService.getVendorInfo().id, param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        page++;
        rows.push(...res.content);
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

  async deleteMachine() {
    this.spineer.show();
    try {
      await this.machineService.deleteMachine(this.userService.getVendorInfo().id, this.selectedMachine.id).toPromise();
      this.toastr.success(this.selectedMachine.name + ' deleted.');
    } catch (e) {
      this.toastr.error('We are sorry, ' + this.selectedMachine.name + ' delete failed. Please try again later.');
      console.log(e);
    } finally {
      this.spineer.hide();
    }
    const filteredData = this.rowData.filter(x => x.id !== this.selectedMachine.id);
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
          columnInstance.setModel({ type: '', filter: '' });
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
