import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { ProcessPricingService } from 'src/app/service/process-pricing.service';
import { GridOptions } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';

@Component({
  selector: 'app-pricing-estimator',
  templateUrl: './pricing-estimator.component.html',
  styleUrls: ['./pricing-estimator.component.css']
})
export class PricingEstimatorComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;

  tableControlReady = false;
  cloneData = {};
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
      name: 'Pricing Name', checked: false,
      field: 'name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Profile Name', checked: false,
      field: 'processProfile.name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Equipment', checked: false,
      field: 'equipment', query: {
        type: '',
        filter: '',
      }
    },

    {
      name: 'Material', checked: false,
      field: 'material', query: {
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
      name: 'Pricing Name', checked: true, field: 'name'
    },
    {
      name: 'Profile Name', checked: true, field: 'processProfile.name'
    },
    {
      name: 'Equipment', checked: true, field: 'equipment'
    },
    {
      name: 'Material', checked: true, field: 'material'
    }
  ];
  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs: Array<any> = [
    { headerName: 'Pricing No', field: 'id', hide: false, sortable: true, filter: false, },
    {
      headerName: 'Pricing Name', field: 'name', hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        return param.data.processProfile.name + ': ' + param.data.name;
      },
    },
    { headerName: 'Profile Name', field: 'processProfile.name', hide: false, sortable: true, filter: false },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Equipment', field: 'equipment',
      hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processProfile.processMachineServingMaterialList[0] ? param.data.processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name : '';
        return value;
      },
      valueGetter: (param) => {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processProfile.processMachineServingMaterialList[0] ? param.data.processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name : '';
        return value;
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Material', field: 'material',
      hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        let value = '';
        if (param.data.processProfile.processMachineServingMaterialList.length > 0) {
          param.data.processProfile.processMachineServingMaterialList.map((mat, index) => {
            if (index === 0) {
              value += mat.machineServingMaterial.material.name;
            } else {
              value += ', ' + mat.machineServingMaterial.material.name;
            }
          });
        }
        return value;
      },
      valueGetter: (param) => {
        let value = '';
        if (param.data.processProfile.processMachineServingMaterialList.length > 0) {
          param.data.processProfile.processMachineServingMaterialList.map((mat, index) => {
            if (index === 0) {
              value += mat.machineServingMaterial.material.name;
            } else {
              value += ', ' + mat.machineServingMaterial.material.name;
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
    public processPricingService: ProcessPricingService
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
              if (item.valueSignType === 'positive') {
                value += `${item.value} ${item.unitType.symbol}`;
              } else if (item.valueSignType === 'absolute') {
                value += `| ${item.value} | ${item.unitType.symbol}`;
              } else {
                value += `- ${item.value} ${item.unitType.symbol}`;
              }
            }
          });
          return value;
        },
        valueGetter: (params: any) => {
          let value = '';
          params.data.processPricingConditionList.map((item, innerIndex) => {
            if (index === innerIndex) {
              value = `${item.processPricingConditionType.name} ${item.operatorType.symbol} `;
              if (item.valueSignType === 'positive') {
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
}
