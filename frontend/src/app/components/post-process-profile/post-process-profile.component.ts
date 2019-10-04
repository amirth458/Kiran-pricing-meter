import { Component, OnInit, ViewChild } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { PostProcessProfileService } from 'src/app/service/post-process-profile.service';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-process-profile',
  templateUrl: './post-process-profile.component.html',
  styleUrls: ['./post-process-profile.component.css']
})
export class PostProcessProfileComponent implements OnInit {

  @ViewChild('copyModal') copyModal;
  @ViewChild('deleteModal') deleteModal;

  newProfileName = '';
  cloneData;

  selectedProfile = null;
  tableControlReady = false;

  processParameterType: any = [];
  processDimensionalPropertyList: any = [];
  processMaterialCharacteristicList: any = [];


  searchColumns = [
    {
      name: 'Post-Process No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Name', checked: false,
      field: 'name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Nickname', checked: false,
      field: 'parameterNickName', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Equipment/Asset', checked: false,
      field: 'asset', query: {
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
    },
    {
      name: 'Post-Process Family', checked: false,
      field: 'family', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Post-Process Type', checked: false,
      field: 'postProcessType', query: {
        type: '',
        filter: '',
      }
    }
  ];

  filterColumns = [
    {
      name: 'Post-Process No', checked: true, field: 'id'
    },
    {
      name: 'Post-Process Name', checked: true, field: 'name'
    },
    {
      name: 'Post-Process Nickname', checked: true, field: 'parameterNickName'
    },
    {
      name: 'Equipment/Asset', checked: true, field: 'asset'
    },
    {
      name: 'Material', checked: true, field: 'material'
    },
    {
      name: 'Post-Process Family', checked: true, field: 'family'
    },
    {
      name: 'Post-Process Type', checked: true, field: 'postProcessType'
    }
  ];


  type = ['search', 'filter'];

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };

  columnDefs: Array<any> = [
    { headerName: 'Post-Process No', field: 'id', hide: false, sortable: true, filter: false },
    { headerName: 'Post-Process Name', field: 'name', hide: false, sortable: true, filter: false },
    { headerName: 'Post-Process Nickname', field: 'parameterNickName', hide: false, sortable: true, filter: false },
    {
      headerName: 'Equipment/Asset', field: 'asset', hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        const machineList = param.data.processMachineServingMaterialList[0];
        if (machineList) {
          return machineList.machineServingMaterial.vendorMachinery.equipment.name;
        }
        return '';
      }
    }, {
      headerName: 'Material', field: 'material', hide: false, sortable: true, filter: false,
      cellRenderer(params) {
        let materials = '';
        params.data.processMachineServingMaterialList.map((x, index) => {
          if (index === 0) {
            materials = x.machineServingMaterial.material.name;
          } else {
            materials = materials + ',' + x.machineServingMaterial.material.name;
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
        let materials = '';
        params.data.processMachineServingMaterialList.map((x, index) => {
          if (index === 0) {
            materials = x.machineServingMaterial.material.name;
          } else {
            materials = materials + ',' + x.machineServingMaterial.material.name;
          }
        });
        return materials;
      }
    },
    {
      headerName: 'Post-Process Family', field: 'family', hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        const machineList = param.data.processMachineServingMaterialList[0];
        if (machineList) {
          return machineList.machineServingMaterial.vendorMachinery.equipment.processFamily.name;
        }
        return '';
      },
      valueGetter: (param) => {
        const machineList = param.data.processMachineServingMaterialList[0];
        if (machineList) {
          return machineList.machineServingMaterial.vendorMachinery.equipment.processFamily.name;
        }
        return '';
      }
    },
    {
      headerName: 'Post-Process Type', field: 'postProcessType', hide: false, sortable: true, filter: false,
      cellRenderer(param): any {
        const machineList = param.data.processMachineServingMaterialList[0];
        if (machineList) {
          return machineList.machineServingMaterial.vendorMachinery.equipment.processFamily.processType.name;
        }
        return '';
      },
      valueGetter: (param) => {
        const machineList = param.data.processMachineServingMaterialList[0];
        if (machineList) {
          return machineList.machineServingMaterial.vendorMachinery.equipment.processFamily.processType.name;
        }
        return '';
      }
    }
  ];


  gridOptions: GridOptions;

  rowData = [];
  pageSize = 10;
  navigation;
  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public postProcessService: PostProcessProfileService,
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
      headerHeight: 35
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

  async copyRow() {
    this.spineer.show();
    const postData = {
      name: this.newProfileName || 'Post-Process Profile - ' + this.getRandomString(7),
      machineServingMaterial: this.cloneData.machineServingMaterial,
      processDimensionalPropertyList: this.cloneData.processDimensionalPropertyList,
      processMaterialCharacteristicList: this.cloneData.processMaterialCharacteristicList,
      processParameterList: this.cloneData.processParameterList,
      processProfileType: this.cloneData.processProfileType,
      vendorId: this.cloneData.vendorId,
    };
    // tslint:disable-next-line:max-line-length
    const res = await this.postProcessService.saveProfile(this.userService.getVendorInfo().id, postData).toPromise();
    const startIndex = this.rowData.indexOf(this.cloneData);
    const frontSlice = this.rowData.slice(0, startIndex + 1);
    const endSlice = this.rowData.slice(startIndex + 1);
    // this.rowData = frontSlice.concat([{ ...this.cloneData, name: this.cloneData.name + ' - COPY', id: '-' }].concat(endSlice));
    this.rowData = frontSlice.concat([res].concat(endSlice));
    this.gridOptions.api.setRowData(this.rowData);
    this.spineer.hide();
    this.copyModal.nativeElement.click();

  }

  async deleteProfile() {
    this.spineer.show();
    try {
      await this.postProcessService.deleteProfile(this.userService.getVendorInfo().id, this.selectedProfile.id).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }

    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedProfile.id);
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
      const res = await this.postProcessService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();
      this.rowData = res || [];
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }

  }

  async getMetaColumns() {
    const processParameterType = await this.processMetaData.getProcessParameterType(true).toPromise();
    const processDimensionalPropertyList = await this.processMetaData.getProcessDimensionalPropertyType(true).toPromise();
    const processMaterialCharacteristicList = await this.processMetaData.getProcessMaterialCharacteristicType(true).toPromise();

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
    });


    this.columnDefs.push({
      headerName: 'Actions',
      width: 140,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: (param) => this.editRow(param),
          copy: (param) => {
            this.copyModal.nativeElement.click();
            this.cloneData = param.data;
          },
          delete: async (param) => {
            this.deleteModal.nativeElement.click();
            this.selectedProfile = param.data;
          },
          canEdit: true,
          canCopy: false,
          canDelete: true,
        }
      }
    });

    availableColumns.map(x => {
      if (visibleColumns < 3) {
        this.filterColumns.push({
          name: x.name, checked: true,
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


