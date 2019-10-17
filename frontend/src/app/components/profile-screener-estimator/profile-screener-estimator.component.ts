import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-screener-estimator',
  templateUrl: './profile-screener-estimator.component.html',
  styleUrls: ['./profile-screener-estimator.component.css']
})
export class ProfileScreenerEstimatorComponent implements OnInit {

  @ViewChild('copyModal') copyModal;


  newProfileName = '';
  cloneData;

  selectedProfile = null;
  tableControlReady = false;

  processParameterType: any = [];
  processDimensionalPropertyList: any = [];
  processMaterialCharacteristicList: any = [];


  searchColumns = [
    {
      name: 'Profile No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Profile Name', checked: false,
      field: 'name', query: {
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
      name: 'Materials', checked: false,
      field: 'materials', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Parameter Nickname', checked: false,
      field: 'parameterNickName', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Process Type', checked: false,
      field: 'processProfileType.name', query: {
        type: '',
        filter: '',
      }
    },
  ];

  filterColumns = [
    {
      name: 'Profile No', checked: true, field: 'id'
    },
    {
      name: 'Profile Name', checked: true, field: 'name'
    },
    {
      name: 'Equipment', checked: true, field: 'equipment'
    },
    {
      name: 'Materials', checked: true, field: 'materials'
    },
    {
      name: 'Parameter Nickname', checked: true, field: 'parameterNickName'
    },
    {
      name: 'Process Type', checked: true, field: 'processProfileType.name'
    },
  ];


  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs: Array<any> = [
    { headerName: 'Process Profile No', field: 'id', hide: false, sortable: true, filter: false },
    { headerName: 'Process Name', field: 'name', hide: false, sortable: true, filter: false },
    // tslint:disable-next-line:max-line-length
    {
      headerName: 'Equipment', field: 'equipment',
      hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processMachineServingMaterialList[0] ? param.data.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name : '';
        return value;
      },
      valueGetter: (param) => {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processMachineServingMaterialList[0] ? param.data.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.name : '';
        return value;
      },

    },
    {
      headerName: 'Materials', field: 'materials',
      hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        let value = '';
        if (param.data.processMachineServingMaterialList.length > 0) {
          param.data.processMachineServingMaterialList.map((mat, index) => {
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
        if (param.data.processMachineServingMaterialList.length > 0) {
          param.data.processMachineServingMaterialList.map((mat, index) => {
            if (index === 0) {
              value += mat.machineServingMaterial.material.name;
            } else {
              value += ', ' + mat.machineServingMaterial.material.name;
            }
          });
        }
        return value;
      }

    },
    { headerName: 'Parameter Nickname', field: 'parameterNickName', hide: false, sortable: true, filter: false },
    {
      headerName: 'Process Type', field: 'processProfileType.name', hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processMachineServingMaterialList[0] ? param.data.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.processTypeName : '';
        return value;
      },
      valueGetter: (param) => {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processMachineServingMaterialList[0] ? param.data.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.processTypeName : '';
        return value;
      }
    }
  ];


  gridOptions: GridOptions;

  rowData;
  pageSize = 10;

  navigation;
  highlightedRows = [192, 2];
  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public processService: ProcessProfileService,
    public processMetaData: ProcessMetadataService,
    public toastr: ToastrService
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }


  async ngOnInit() {
    this.spineer.show();

    await this.getMetaColumns();
    await this.getProfiles();
    this.createColumns();


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
      rowSelection: 'multiple'
    };
    this.tableControlReady = true;
    this.spineer.hide();

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

  onGridReady(event) {
    this.gridOptions.api.forEachNode(node => {
      const data = node.data;
      if (this.highlightedRows.includes(data.id)) {
        node.selectThisNode(true);
      }

    });
  }

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }

  async copyRow() {
    this.processService.storeCloneData(this.cloneData);
    this.route.navigateByUrl(this.route.url + '/clone');
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
      const res = await this.processService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();
      this.rowData = res || [];
    } catch (e) {
      console.log(e);
      this.spineer.hide();
    }
  }

  async getMetaColumns() {
    const processParameterType = await this.processMetaData.getProcessParameterType().toPromise();
    const processDimensionalPropertyList = await this.processMetaData.getProcessDimensionalPropertyType().toPromise();
    const processMaterialCharacteristicList = await this.processMetaData.getProcessMaterialCharacteristicType().toPromise();

    this.processParameterType = processParameterType.metadataList;
    this.processDimensionalPropertyList = processDimensionalPropertyList.metadataList;
    this.processMaterialCharacteristicList = processMaterialCharacteristicList.metadataList;
  }

  createColumns() {
    const availableColumnNames = [];
    const availableColumns = [];
    let visibleColumns = 0;
    this.rowData.map(row => {
      row.processParameterList.map(x => {
        if (!availableColumnNames.includes(x.processParameterType.name)) {
          availableColumnNames.push(x.processParameterType.name);
          availableColumns.push(x.processParameterType);
          this.columnDefs.push(
            {
              headerName: x.processParameterType.name,
              field: x.processParameterType.name.replace(/ /g, ''),
              hide: true,
              sortable: true,
              filter: false,
              cellRenderer(params: any): any {
                let value = '';
                params.data.processParameterList.map(item => {
                  if (item.processParameterType.name === x.processParameterType.name) {
                    if (item.valueSignType.symbol === '+') {
                      if (item.operatorType.name === 'is equal to') {
                        value = item.value.toString() + ' ' + item.unitType.symbol;
                      } else {
                        value = item.operatorType.symbol + ' ' + item.value.toString() + ' ' + item.unitType.symbol;
                      }
                    } else {
                      if (item.operatorType.name === 'is equal to') {
                        value = '-' + item.value.toString() + ' ' + item.unitType.symbol;
                      } else {
                        value = item.operatorType.symbol + ' -' + item.value.toString() + ' ' + item.unitType.symbol;
                      }
                    }
                  }
                });
                return value;
              },
              valueGetter: (params: any) => {
                let value = '';
                params.data.processParameterList.map(item => {
                  if (item.processParameterType.name === x.processParameterType.name) {
                    if (item.valueSignType.symbol === '+') {
                      if (item.operatorType.name === 'is equal to') {
                        value = item.value.toString() + ' ' + item.unitType.symbol;
                      } else {
                        value = item.operatorType.symbol + ' ' + item.value.toString() + ' ' + item.unitType.symbol;
                      }
                    } else {
                      if (item.operatorType.name === 'is equal to') {
                        value = '-' + item.value.toString() + ' ' + item.unitType.symbol;
                      } else {
                        value = item.operatorType.symbol + ' -' + item.value.toString() + ' ' + item.unitType.symbol;
                      }
                    }
                  }
                });
                return value;
              }
            }
          );
        }

      });
      row.processDimensionalPropertyList.map(x => {
        if (!availableColumnNames.includes(x.processDimensionalPropertyType.name)) {
          availableColumnNames.push(x.processDimensionalPropertyType.name);
          availableColumns.push(x.processDimensionalPropertyType);
          this.columnDefs.push(
            {
              headerName: x.processDimensionalPropertyType.name,
              field: x.processDimensionalPropertyType.name.replace(/ /g, ''),
              hide: true,
              sortable: true,
              filter: false,
              cellRenderer(params: any): any {
                let value = '';
                params.data.processDimensionalPropertyList.map(item => {
                  // if (item.processDimensionalPropertyType.name === x.processDimensionalPropertyType.name) {
                  //   value = item.valueSignType.symbol === '+' ? item.value.toString() : '-' + item.value.toString();
                  // }
                  if (item.valueSignType.symbol === '+') {
                    if (item.operatorType.name === 'is equal to') {
                      value = item.value.toString() + ' ' + item.unitType.symbol;
                    } else {
                      value = item.operatorType.symbol + ' ' + item.value.toString() + ' ' + item.unitType.symbol;
                    }
                  } else {
                    if (item.operatorType.name === 'is equal to') {
                      value = '-' + item.value.toString() + ' ' + item.unitType.symbol;
                    } else {
                      value = item.operatorType.symbol + ' -' + item.value.toString() + ' ' + item.unitType.symbol;
                    }
                  }
                });
                return value;
              },
              valueGetter: (params: any) => {
                let value = '';
                params.data.processDimensionalPropertyList.map(item => {
                  // if (item.processDimensionalPropertyType.name === x.processDimensionalPropertyType.name) {
                  //   value = item.valueSignType.symbol === '+' ? item.value.toString() : '-' + item.value.toString();
                  // }
                  if (item.valueSignType.symbol === '+') {
                    if (item.operatorType.name === 'is equal to') {
                      value = item.value.toString() + ' ' + item.unitType.symbol;
                    } else {
                      value = item.operatorType.symbol + ' ' + item.value.toString() + ' ' + item.unitType.symbol;
                    }
                  } else {
                    if (item.operatorType.name === 'is equal to') {
                      value = '-' + item.value.toString() + ' ' + item.unitType.symbol;
                    } else {
                      value = item.operatorType.symbol + ' -' + item.value.toString() + ' ' + item.unitType.symbol;
                    }
                  }
                });
                return value;
              }
            }
          );
        }
      });

      row.processMaterialCharacteristicList.map(x => {
        if (!availableColumnNames.includes(x.processMaterialCharacteristicType.name)) {
          availableColumnNames.push(x.processMaterialCharacteristicType.name);
          availableColumns.push(x.processMaterialCharacteristicType);
          this.columnDefs.push(
            {
              headerName: x.processMaterialCharacteristicType.name,
              field: x.processMaterialCharacteristicType.name.replace(/ /g, ''),
              hide: true,
              sortable: true,
              filter: false,
              cellRenderer(params: any): any {
                let value = '';
                params.data.processMaterialCharacteristicList.map(item => {
                  if (item.processMaterialCharacteristicType.name === x.processMaterialCharacteristicType.name) {
                    value = item.valueSignType.symbol === '+' ? item.value.toString() : '-' + item.value.toString();
                  }
                });
                return value;
              },
              valueGetter: (params: any) => {
                let value = '';
                params.data.processMaterialCharacteristicList.map(item => {
                  if (item.processMaterialCharacteristicType.name === x.processMaterialCharacteristicType.name) {
                    value = item.valueSignType.symbol === '+' ? item.value.toString() : '-' + item.value.toString();
                  }
                });
                return value;
              }
            }
          );
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
          },
          view: async (param) => {
            window.alert('view');
          },
          canEdit: false,
          canCopy: false,
          canDelete: false,
          canView: true,
        }
      }
    });

    availableColumns.map(x => {
      if (visibleColumns < 3) {
        this.filterColumns.push({
          name: x.name, checked: false,
          field: x.name.replace(/ /g, '')
        });
        visibleColumns++;
      } else {
        this.filterColumns.push({
          name: x.name, checked: false,
          field: x.name.replace(/ /g, '')
        });
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
