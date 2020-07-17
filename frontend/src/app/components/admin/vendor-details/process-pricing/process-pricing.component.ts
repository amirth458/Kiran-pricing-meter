import { Component, OnInit, ViewChild } from '@angular/core';

import { ColDef, GridOptions } from 'ag-grid-community';

import { Router } from '@angular/router';
import { ActionCellRendererComponent } from 'src/app/common/action-cell-renderer/action-cell-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { ProcessPricingService } from 'src/app/service/process-pricing.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PricingProfile, ProcessProfile } from 'src/app/model/part.model';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { forkJoin } from 'rxjs';
import { Util } from '../../../../util/Util';

@Component({
  selector: 'app-admin-vendor-process-pricing',
  templateUrl: './process-pricing.component.html',
  styleUrls: ['./process-pricing.component.css']
})
export class AdminVendorProcessPricingComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('associatePricingProfiles') associatePricingProfiles;

  isAdminAuthenticated = Util.isUserAuthenticated();

  tableControlReady = false;
  cloneData = {};
  processPricingParameterList: any = [];
  processPricingConditionListprocessDimensionalPropertyList: any = [];

  vendorId = null;
  vendorUserId = null;

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent
  };

  columnDefs: ColDef[] = [
    {
      headerName: 'Pricing No',
      field: 'id',
      hide: false,
      sortable: true,
      filter: false,
      width: 110,
      sort: 'desc',
      suppressSizeToFit: true
    },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Pricing Profile',
      cellClass: 'p-0',
      tooltipField: 'pricingFullName',
      field: 'pricingFullName',
      hide: false,
      sortable: true,
      filter: false
    },
    { headerName: 'Process Profile', field: 'processProfile.name', hide: false, sortable: true, filter: false },
    { headerName: 'Parameter Set Nickname', field: 'name', hide: false, sortable: true, filter: false },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Equipment',
      field: 'equipment',
      hide: false,
      sortable: true,
      filter: false,
      cellRenderer(param): any {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processProfile.processMachineServingMaterialList[0]
          ? param.data.processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery
              .equipment.name
          : '';
        return value;
      },
      valueGetter: param => {
        // tslint:disable-next-line:max-line-length
        const value = param.data.processProfile.processMachineServingMaterialList[0]
          ? param.data.processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery
              .equipment.name
          : '';
        return value;
      }
    },
    {
      // tslint:disable-next-line:max-line-length
      headerName: 'Material',
      field: 'material',
      hide: false,
      sortable: true,
      filter: false,
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
      valueGetter: param => {
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

  columnState;
  processProfiles: ProcessProfile[] = [];
  selectedPricingProfile = null;
  selectedProfilesForAssociating = {};

  constructor(
    public route: Router,
    public modalService: NgbModal,
    public spineer: NgxSpinnerService,
    public userService: UserService,
    public processPricingService: ProcessPricingService,
    public processService: ProcessProfileService,
    public toastr: ToastrService
  ) {
    this.navigation = this.route.getCurrentNavigation();
  }

  async ngOnInit() {
    const routeParams = this.route.url.split('/');
    this.vendorUserId = routeParams[3];
    const vendorUserDetails = await this.userService.getUserDetails(this.vendorUserId).toPromise();
    this.vendorId = vendorUserDetails.vendor.id;

    this.spineer.show();
    await this.getProfiles();
    this.createColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationAutoPageSize: true,
      // paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
      }
    };
    this.tableControlReady = true;

    if (this.navigation && this.navigation.extras.state && this.navigation.extras.state.toast) {
      const toastInfo = this.navigation.extras.state.toast;
      if (toastInfo.type === 'success') {
        this.toastr.success(toastInfo.body);
      } else {
        this.toastr.error(toastInfo.body);
      }
    }
  }

  gridReady($event) {
    this.gridOptions.api.sizeColumnsToFit();
    // setTimeout(() => {
    //   this.autoFitColumns($event);
    // }, 100);
  }

  autoFitColumns($event) {
    $event.columnApi.autoSizeColumns(['pricingFullName']);
    // this.gridOptions.api.sizeColumnsToFit();
  }

  pageSizeChanged(value) {
    this.gridOptions.paginationAutoPageSize = false;
    this.gridOptions.api.paginationSetPageSize(Number(value));
    // this.gridOptions.api.sizeColumnsToFit();
  }

  editRow(event) {
    this.route.navigateByUrl(this.route.url + '/edit/' + event.data.id);
  }

  async copyRow() {
    this.processPricingService.storeCloneData(this.cloneData);
    this.route.navigateByUrl(this.route.url + '/clone');
  }

  async deleteRow(event) {
    this.spineer.show();
    try {
      await this.processPricingService.deleteProfile(this.vendorId, this.selectedProfileId.id).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }

    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedProfileId.id);
    this.rowData = filteredData;
    this.modalService.open(this.deleteModal, {
      centered: true
    });
  }

  reconfigColumns() {
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    // this.gridOptions.api.sizeColumnsToFit();
  }

  async getProfiles() {
    try {
      const res = await this.processPricingService.getAllProfiles(this.vendorId).toPromise();
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
        },
        valueGetter: (params: any) => {
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
    // for (let index = 0; index < maxComponent; index++) {
    //   this.filterColumns.push(
    //     {
    //       name: `Pricing Component ${index + 1}`, checked: false, field: `pricingComponent${index + 1}`
    //     });
    //   this.columnDefs.push({
    //     headerName: `Pricing Component ${index + 1}`,
    //     field: `pricingComponent${index + 1}`,
    //     hide: true,
    //     sortable: true,
    //     filter: false,
    //     cellRenderer(params: any): any {
    //       let value = '';
    //       params.data.processPricingParameterList.map((item, innerIndex) => {
    //         if (innerIndex == index) {
    //           value = `${item.currency.symbol}${item.price} / ${item.quantityUnitType.name}`;
    //         }
    //       });
    //       return value;
    //     },
    //     valueGetter: (params: any) => {
    //       let value = '';
    //       params.data.processPricingParameterList.map((item, innerIndex) => {
    //         if (innerIndex == index) {
    //           value = `${item.currency.symbol}${item.price} / ${item.quantityUnitType.name}`;
    //         }
    //       });
    //       return value;
    //     }
    //   });
    // }

    this.columnDefs.push({
      headerName: 'Actions',
      pinned: 'right',
      width: 130,
      suppressSizeToFit: true,
      cellRenderer: 'actionCellRenderer',
      cellRendererParams: {
        action: {
          edit: param => this.editRow(param),
          copy: param => {
            this.cloneData = JSON.parse(JSON.stringify(param.data));
            this.copyRow();
          },
          delete: async param => {
            this.modalService.open(this.deleteModal, {
              centered: true
            });
            this.selectedProfileId = param.data;
          },
          associatePricingProfile: param => {
            console.log('Associate Pricing Profiles');
            const data = param.data;
            this.selectedPricingProfile = data;
            this.selectedProfilesForAssociating = {};

            this.modalService.open(this.associatePricingProfiles, {
              size: 'lg',
              centered: true
            });

            if (!this.processProfiles.length) {
              this.getProcessProfile();
            }
          },
          canEdit: this.isAdminAuthenticated,
          canCopy: this.isAdminAuthenticated,
          canDelete: this.isAdminAuthenticated,
          canAssociatePricingProfile: this.isAdminAuthenticated
        }
      }
    });
  }

  async deletePricing() {
    this.spineer.show();
    try {
      await this.processPricingService.deleteProfile(this.vendorId, this.selectedProfileId.id).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.spineer.hide();
    }

    // tslint:disable-next-line:triple-equals
    const filteredData = this.rowData.filter(x => x.id != this.selectedProfileId.id);
    this.rowData = filteredData;
    this.modalService.dismissAll();
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

  isProfileChecked(profileId: string) {
    if (this.selectedPricingProfile.processProfile.id != profileId) {
      return Object.keys(this.selectedProfilesForAssociating).includes(profileId.toString());
    }
    return true;
  }

  toggleProfileSelection(profile: ProcessProfile, check: boolean) {
    if (this.selectedPricingProfile.processProfile.id != profile.id) {
      if (check) {
        this.selectedProfilesForAssociating[profile.id.toString()] = profile;
      } else {
        delete this.selectedProfilesForAssociating[profile.id.toString()];
      }
    }
  }

  confirmAssociatingProfile() {
    // return;
    this.spineer.show();
    const saveCalls = Object.keys(this.selectedProfilesForAssociating).map(item => {
      const postData: PricingProfile = {
        ...this.selectedPricingProfile,
        processProfile: this.selectedProfilesForAssociating[item]
      };
      console.log({ postData });
      return this.processPricingService.saveProfile(this.vendorId, postData);
    });

    console.log({ saveCalls });

    forkJoin(saveCalls).subscribe(
      async data => {
        this.gridOptions.api.setRowData([
          ...data.map(
            profile =>
              new Object({
                ...profile,
                pricingFullName: `${profile && profile.processProfile && profile.processProfile.name} : ${profile.name}`
              })
          ),
          ...this.rowData
        ]);

        this.toastr.success('Associated Profiles Successfully');
        this.modalService.dismissAll();
        this.spineer.hide();

        this.selectedPricingProfile = null;
        this.selectedProfilesForAssociating = {};
      },
      err => {
        console.error({ err });

        this.toastr.error('Error While Associating Profiles');
        this.modalService.dismissAll();
        this.spineer.hide();

        this.selectedPricingProfile = null;
        this.selectedProfilesForAssociating = {};
      }
    );
  }

  async getProcessProfile() {
    this.spineer.show();
    try {
      const res = await this.processService.getAllProfiles(this.vendorId).toPromise();
      this.processProfiles = (res || []).sort(
        (prev: ProcessProfile, curr: ProcessProfile) => Number(prev.name > curr.name) - Number(prev.name < curr.name)
      );
      this.spineer.hide();
    } catch (e) {
      console.log(e);
      this.modalService.dismissAll();
    } finally {
      this.spineer.hide();
    }
  }

  canConfirmAssociation() {
    return JSON.stringify(this.selectedProfilesForAssociating) === '{}';
  }

  addProcessPricing() {
    if (this.isAdminAuthenticated) {
      this.route.navigateByUrl(this.route.url + '/add');
    }
  }
}
