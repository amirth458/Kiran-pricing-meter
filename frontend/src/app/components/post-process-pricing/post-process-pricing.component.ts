import { Component, OnInit, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { PostProcessPricingService } from 'src/app/service/post-process-pricing.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-post-process-pricing',
  templateUrl: './post-process-pricing.component.html',
  styleUrls: ['./post-process-pricing.component.css']
})
export class PostProcessPricingComponent implements OnInit {


  @ViewChild('deleteModal') deleteModal;

  tableControlReady = false;

  processPricingParameterList: any = [];
  processPricingConditionListprocessDimensionalPropertyList: any = [];

  searchColumns = [
    {
      name: 'Pricing No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Pricing Profile', checked: false,
      field: 'name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Profile', checked: false,
      field: 'processProfile.name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Equipment', checked: false,
      field: 'processProfile.machineServingMaterial.vendorMachinery.equipment.name', query: {
        type: '',
        filter: '',
      }
    },

    {
      name: 'Material', checked: false,
      field: 'processProfile.machineServingMaterial.material.name', query: {
        type: '',
        filter: '',
      }
    }
  ];
  filterColumns = [
    {
      name: 'Pricing No', checked: true, field: 'id'
    },
    {
      name: 'Pricing Profile', checked: true, field: 'name'
    },
    {
      name: 'Post-Process Profile', checked: true, field: 'processProfile.name'
    },
    {
      name: 'Equipment', checked: true, field: 'processProfile.machineServingMaterial.vendorMachinery.equipment.name'
    },
    {
      name: 'Material', checked: true, field: 'processProfile.machineServingMaterial.material.name'
    }
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs: Array<any> = [
    { headerName: 'Pricing No', field: 'id', hide: false, sortable: true, filter: false, },
    { headerName: 'Pricing Profile', field: 'name', hide: false, sortable: true, filter: false },
    { headerName: 'Post-Process Profile', field: 'processProfile.name', hide: false, sortable: true, filter: false },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Equipment', field: 'processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name',
      hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processProfile.processMachineServingMaterialList[0] ? param.data.processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name : '';
        return value;
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Material', field: 'processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name',
      hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        let value = '';
        if (param.data.processProfile.processMachineServingMaterialList[0]) {
          // tslint:disable-next-line:max-line-length
          param.data.processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.materialList.map((material, index) => {
            if (index == 0) {
              value += material.name;
            } else {
              value += ', ' + material.name;
            }
          });
        }

        return value;
      }
    }
  ];

  gridOptions: GridOptions;

  selectedProfileId = null;

  rowData;
  pageSize = 10;

  navigation;

  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public processPricingService: PostProcessPricingService,
    public toastr: ToastrService
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }

  async ngOnInit() {
    this.spineer.show();

    await this.getProfiles();
    this.createColumns();

    this.tableControlReady = true;

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
    if (this.navigation && this.navigation.extras.state && this.navigation.extras.state.toast) {
      const toastInfo = this.navigation.extras.state.toast;
      if (toastInfo.type == 'success') {
        this.toastr.success(toastInfo.body);
      } else {
        this.toastr.error(toastInfo.body);
      }
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

  async deleteRow(event) {
    this.spineer.show();
    try {
      await this.processPricingService.deleteProfile(this.userService.getVendorInfo().id, this.selectedProfileId.id).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }

    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedProfileId.id);
    this.rowData = filteredData;
    this.deleteModal.nativeElement.click();
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

  async getProfiles() {
    try {
      const res = await this.processPricingService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();
      this.rowData = res || [];
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }
  }

  createColumns() {
    let maxCondition = 0;
    let maxComponent = 0;

    this.rowData.map((x, index) => {
      if (maxCondition < x.processPricingConditionList.length) {
        maxCondition = x.processPricingConditionList.length;
      }
      if (maxComponent < x.processPricingParameterList.length) {
        maxComponent = x.processPricingParameterList.length;
      }
    });

    for (let index = 0; index < maxCondition; index++) {
      this.filterColumns.push(
        {
          name: `Pricing Condition ${index + 1}`, checked: false, field: `condition${index + 1}`
        });
      this.columnDefs.push({
        headerName: `Pricing Condition ${index + 1}`,
        field: `condition${index + 1}`,
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer(params: any): any {
          let value = '';
          params.data.processPricingConditionList.map((item, innerIndex) => {
            if (index === innerIndex) {
              value = `${item.processPricingConditionType.name} ${item.operatorType.symbol} `;
              if (item.valueSignType == 'positive') {
                value += `${item.value} ${item.unitType.symbol}`;
              } else if (item.valueSignType === 'absolute') {
                value += `| ${item.value} | ${item.unitType.symbol}`;
              } else {
                value += `- ${item.value} ${item.unitType.symbol}`;
              }
            }
          });
          return value;
        }
      });

    }
    for (let index = 0; index < maxComponent; index++) {
      this.filterColumns.push(
        {
          name: `Pricing Component ${index + 1}`, checked: false, field: `pricingComponent${index + 1}`
        });
      this.columnDefs.push({
        headerName: `Pricing Component ${index + 1}`,
        field: `pricingComponent${index + 1}`,
        hide: true,
        sortable: true,
        filter: false,
        cellRenderer(params: any): any {
          let value = '';
          params.data.processPricingParameterList.map((item, innerIndex) => {
            if (innerIndex == index) {
              value = `${item.currency.symbol}${item.price} / ${item.quantityUnitType.name}`;
            }
          });
          return value;
        }
      });
    }


    this.columnDefs.push({
      headerName: 'Actions',
      width: 140,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          copy: (param) => {
          },
          delete: async (param) => {
            this.deleteModal.nativeElement.click();
            this.selectedProfileId = param.data;
          },
          canEdit: true,
          canCopy: false,
          canDelete: true,
        }
      }
    });

    let conditionActive = false;
    let componentActive = false;
    this.filterColumns = this.filterColumns.map((column) => {
      if (!column.checked && (!componentActive || !conditionActive)) {
        if (column.name.startsWith('Condition') && !conditionActive) {
          conditionActive = true;
          return { ...column, checked: true };
        }
        if (column.name.startsWith('Pricing') && !componentActive) {
          componentActive = true;
          return { ...column, checked: true };
        }
        return { ...column };
      } else {
        return { ...column };
      }
    });

  }

  async deletePricing() {
    this.spineer.show();
    try {
      await this.processPricingService.deleteProfile(this.userService.getVendorInfo().id, this.selectedProfileId.id).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }

    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedProfileId.id);
    this.rowData = filteredData;
    this.deleteModal.nativeElement.click();

  }

  getRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
