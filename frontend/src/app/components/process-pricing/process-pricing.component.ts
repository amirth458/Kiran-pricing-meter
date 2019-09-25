import { Component, OnInit, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as pricings from '../../../assets/static/processPricing';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { ProcessPricingService } from 'src/app/service/process-pricing.service';

@Component({
  selector: 'app-process-pricing',
  templateUrl: './process-pricing.component.html',
  styleUrls: ['./process-pricing.component.css']
})
export class ProcessPricingComponent implements OnInit {

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
      name: 'Process Profile', checked: false,
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
      name: 'Process Profile', checked: true, field: 'processProfile.name'
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
    { headerName: 'Pricing No', field: 'id', hide: false, sortable: true, filter: true, },
    { headerName: 'Pricing Profile', field: 'name', hide: false, sortable: true, filter: true },
    { headerName: 'Process Profile', field: 'processProfile.name', hide: false, sortable: true, filter: true },
    // tslint:disable-next-line:max-line-length
    { headerName: 'Equipment', field: 'processProfile.machineServingMaterial.vendorMachinery.equipment.name', hide: false, sortable: true, filter: true },
    { headerName: 'Material', field: 'processProfile.machineServingMaterial.material.name', hide: false, sortable: true, filter: true },
  ];

  gridOptions: GridOptions;

  rowData;
  pageSize = 10;
  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public processPricingService: ProcessPricingService) { }

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

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }

  deleteRow(event) {
    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != event.data.id);
    this.rowData = filteredData;
    console.log(this.rowData);
  }

  searchColumnsChange(event) {
    this.searchColumns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (column.checked) {
        columnInstance.setModel(column.query);
      } else {
        columnInstance.setModel({ type: '', filter: '' });
      }
      this.gridOptions.api.onFilterChanged();
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
    const conditionNames = [];
    const componentName = [];

    this.rowData.map(row => {
      row.processPricingConditionList.map((x, index) => {
        if (!conditionNames.includes(`Condition ${index + 1}`)) {
          conditionNames.push(`Condition ${index + 1}`);
          // this.searchColumns.push(
          //   {
          //     name: `Condition ${index + 1}`, checked: false, field: `condition${index + 1}`, query: {
          //       type: '',
          //       filter: '',
          //     }
          //   });
          this.filterColumns.push(
            {
              name: `Condition ${index + 1}`, checked: false, field: `condition${index + 1}`
            });

          this.columnDefs.push({
            headerName: `Condition ${index + 1}`,
            field: `condition${index + 1}`,
            hide: false,
            sortable: true,
            filter: true,
            cellRenderer(params: any): any {
              let value = '';
              params.data.processPricingConditionList.map(item => {
                if (item.id === x.id) {
                  value = `${item.processPricingConditionType.name} ${item.operatorType.symbol} `;
                  if (item.valueSignType == 'positive') {
                    value += `${item.value} ${item.unitType.symbol}`;
                  } else if (item.valueSignType === 'absolute') {
                    value += `|${item.value}| ${item.unitType.symbol}`;
                  } else {
                    value += `-${item.value} ${item.unitType.symbol}`;
                  }
                }
              });
              return value;
            }
          });
        }
      });

      row.processPricingParameterList.map((x, index) => {
        if (!componentName.includes(`Pricing Component ${index + 1}`)) {
          componentName.push(`Pricing Component ${index + 1}`);
          // this.searchColumns.push(
          //   {
          //     name: `Pricing Component ${index + 1}`, checked: false, field: `pricingComponent${index + 1}`, query: {
          //       type: '',
          //       filter: '',
          //     }
          //   });
          this.filterColumns.push(
            {
              name: `Pricing Component ${index + 1}`, checked: false, field: `pricingComponent${index + 1}`
            });

          this.columnDefs.push({
            headerName: `Pricing Component ${index + 1}`,
            field: `pricingComponent${index + 1}`,
            hide: true,
            sortable: true,
            filter: true,
            cellRenderer(params: any): any {
              let value = '';
              params.data.processPricingParameterList.map(item => {
                if (item.id == x.id) {
                  value = `${item.currency.symbol}${item.price} / ${item.quantityUnitType.name}`;
                }
              });
              return value;
            }
          });
        }
      });
    });


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
