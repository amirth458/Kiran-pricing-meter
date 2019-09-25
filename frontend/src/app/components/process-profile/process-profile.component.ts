import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';

import { GridOptions } from 'ag-grid-community';

import * as processProfiles from '../../../assets/static/processProfile';
import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FilterOption } from 'src/app/model/vendor.model';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { UserService } from 'src/app/service/user.service';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';

@Component({
  selector: 'app-process-profile',
  templateUrl: './process-profile.component.html',
  styleUrls: ['./process-profile.component.css']
})
export class ProcessProfileComponent implements OnInit {

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
      name: 'Process Profile No', checked: false, field: 'id', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Process Profile Name', checked: false,
      field: 'name', query: {
        type: '',
        filter: '',
      }
    },
    {
      name: 'Equipment', checked: false,
      field: 'machineServingMaterial.vendorMachinery.equipment.name', query: {
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
      name: 'Process Profile No', checked: true, field: 'id'
    },
    {
      name: 'Process Profile Name', checked: true, field: 'name'
    },
    {
      name: 'Equipment', checked: true, field: 'machineServingMaterial.vendorMachinery.equipment.name'
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
    { headerName: 'Process Profile No', field: 'id', hide: false, sortable: true, filter: true },
    { headerName: 'Process Profile Name', field: 'name', hide: false, sortable: true, filter: true },
    { headerName: 'Equipment', field: 'machineServingMaterial.vendorMachinery.equipment.name', hide: false, sortable: true, filter: true },
    { headerName: 'Process Type', field: 'processProfileType.name', hide: false, sortable: true, filter: true }
  ];


  gridOptions: GridOptions;

  rowData;
  pageSize = 10;
  constructor(
    public route: Router,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public processService: ProcessProfileService,
    public processMetaData: ProcessMetadataService
  ) { }


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
      name: this.newProfileName || 'Process Profile - ' + this.getRandomString(7),
      machineServingMaterial: this.cloneData.machineServingMaterial,
      processDimensionalPropertyList: this.cloneData.processDimensionalPropertyList,
      processMaterialCharacteristicList: this.cloneData.processMaterialCharacteristicList,
      processParameterList: this.cloneData.processParameterList,
      processProfileType: this.cloneData.processProfileType,
      vendorId: this.cloneData.vendorId,
    };
    // tslint:disable-next-line:max-line-length
    const res = await this.processService.saveProfile(this.userService.getVendorInfo().id, postData).toPromise();
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
      await this.processService.deleteProfile(this.userService.getVendorInfo().id, this.selectedProfile.id).toPromise();
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
      const res = await this.processService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();
      this.rowData = res || [];
    } catch (e) {
      console.log(e);
    } finally {
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
              filter: true,
              cellRenderer(params: any): any {
                let value = '';
                params.data.processParameterList.map(item => {
                  if (item.processParameterType.name === x.processParameterType.name) {
                    value = item.valueSignType.symbol === '+' ? item.value.toString() : '-' + item.value.toString();
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
              filter: true,
              cellRenderer(params: any): any {
                let value = '';
                params.data.processDimensionalPropertyList.map(item => {
                  if (item.processDimensionalPropertyType.name === x.processDimensionalPropertyType.name) {
                    value = item.valueSignType.symbol === '+' ? item.value.toString() : '-' + item.value.toString();
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
              filter: true,
              cellRenderer(params: any): any {
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
            this.copyModal.nativeElement.click();
            this.cloneData = param.data;
          },
          delete: async (param) => {
            this.deleteModal.nativeElement.click();
            this.selectedProfile = param.data;
          },
          canEdit: true,
          canCopy: true,
          canDelete: true,
        }
      }
    });

    availableColumns.map(x => {
      // this.searchColumns.push({
      //   name: x.name, checked: false,
      //   field: x.name.replace(/ /g, ''),
      //   query: {
      //     type: '',
      //     filter: '',
      //   }
      // });
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
