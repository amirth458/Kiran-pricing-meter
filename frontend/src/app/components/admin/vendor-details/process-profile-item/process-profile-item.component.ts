import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MachineService } from 'src/app/service/machine.service';
import { UserService } from 'src/app/service/user.service';
import { MaterialService } from 'src/app/service/material.service';
import { EquipmentService } from 'src/app/service/equipment.service';
import { FilterOption } from 'src/app/model/vendor.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { ProcessPricingService } from 'src/app/service/process-pricing.service';
import { GridOptions } from 'ag-grid-community';
import { FeatureTypeIdEnum } from 'src/app/model/subscription.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-process-profile-item',
  templateUrl: './process-profile-item.component.html',
  styleUrls: ['./process-profile-item.component.css']
})
export class ProcessProfileItemComponent implements OnInit, AfterViewChecked {
  @ViewChild('closeModal') closeModal: ElementRef;
  featureTypes = FeatureTypeIdEnum;
  facilities = [];
  equipments = [];
  materials = [];
  submitActive = true;
  submitClicked = false;

  pricingProfiles = [];
  gridOptions: GridOptions;
  rowData = [];
  columnDefs = [
    {
      headerName: 'Pricing No',
      field: 'id',
      hide: false,
      sortable: false,
      filter: false,
      width: 110
    },
    {
      headerName: 'Pricing Profile',
      field: 'pricingFullName',
      hide: false,
      sortable: false,
      filter: false
    }
  ];

  tabErrors = {
    processParameter: false,
    processDimensionalProperty: false,
    processMaterialCharacteristic: false,
    processSpeedList: false
  };

  filteredProcessParameterList = [];

  form: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null],
    name: [null],
    parameterNickName: [null],
    equipment: [null, Validators.required],
    materialList: [null, Validators.required],
    // processType: [null, Validators.required],
    processParameterList: [[]],
    processDimensionalPropertyList: [[]],
    processMaterialCharacteristicList: [[]],
    processSpeedList: []
  });

  processParameterList = [];
  processDimensionalPropertyList = [];
  processMaterialCharacteristicList = [];
  processSpeedList = [];
  signTypes = [];
  units = [];
  defaultUnits = [];
  conditions = {};

  selectedProcessParameterList = [];
  selectedProcessDimensionalPropertyList = [];
  selectedProcessMaterialCharacteristicList = [];
  selectedProcessSpeedList = [];

  processProfileId = null;

  defaultValues = {
    processParameterList: [],
    processDimensionalPropertyList: [],
    processMaterialCharacteristicList: []
  };
  activeTab = 'processDimensionalPropertyList';
  activeTabName = 'Process Dimensional Properties';
  error = '';

  isNew = true;
  isFormValid = false;

  toleranceBaseIds = [];
  toleranceIncrementIds = [];

  equipmentRemoved = false;
  materialRemoved = false;

  vendorId;
  vendorUserId;

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaData: ProcessMetadataService,
    public processProfileService: ProcessProfileService,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService,
    public processPricingService: ProcessPricingService,
    public toastr: ToastrService
  ) {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: false,
      enableColResize: true,
      rowHeight: 35
    };
  }

  async ngOnInit() {
    try {
      const routeParams = this.route.url.split('/');
      this.vendorUserId = routeParams[3];
      const vendorUserDetails = await this.userService.getUserDetails(this.vendorUserId).toPromise();
      this.vendorId = vendorUserDetails.vendor.id;

      this.spinner.show();
      await this.getInputValues();
      const processParameterType = await this.processMetaData.getProcessParameterType().toPromise();
      const processDimensionalPropertyType = await this.processMetaData.getProcessDimensionalPropertyType().toPromise();
      const processMaterialCharacteristicType = await this.processMetaData
        .getProcessMaterialCharacteristicType()
        .toPromise();
      const operatorType = await this.processMetaData.getoperatorType().toPromise();
      const signType = await this.processMetaData.getValueSignType().toPromise();
      const units = await this.processMetaData.getMeasurementUnitType().toPromise();
      const speedUnits = await this.processMetaData.getAppProcessSpeedType().toPromise();

      const res = await this.processPricingService.getAllProfiles(this.vendorId).toPromise();
      this.pricingProfiles = res || [];

      operatorType.metadataList.map(operator => {
        const addedList = Object.keys(this.conditions);
        if (addedList.includes(operator.operandType.name)) {
          this.conditions[operator.operandType.name].push(operator);
        } else {
          this.conditions[operator.operandType.name] = [operator];
        }
      });

      this.units = units.metadataList;
      this.defaultUnits = this.units.filter(item => item.isDefault);
      this.signTypes = signType.metadataList;

      this.processParameterList = processParameterType.metadataList;
      this.processDimensionalPropertyList = processDimensionalPropertyType.metadataList;
      this.processMaterialCharacteristicList = processMaterialCharacteristicType.metadataList;
      this.processSpeedList = speedUnits.metadataList || [];

      this.processDimensionalPropertyList.map(property => {
        if (property.name.toLowerCase().includes('tolerance base')) {
          this.toleranceBaseIds.push(property.id.toString());
        }
        if (property.name.toLowerCase().includes('tolerance increment')) {
          this.toleranceIncrementIds.push(property.id.toString());
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      if (this.route.url.includes('edit')) {
        this.spinner.show();
        this.isNew = false;
        this.processProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        // tslint:disable-next-line:max-line-length
        let processProfile = await this.processProfileService
          .getProfile(this.vendorId, this.processProfileId)
          .toPromise();
        this.rowData = processProfile.processPricingList.map(item =>
          this.pricingProfiles.find(pricingProfile => pricingProfile.id === item.id)
        );
        processProfile = this.arrangeItems(processProfile);
        this.initForm(processProfile);
        this.materialChanged(true);
      }

      if (this.route.url.includes('clone')) {
        this.isNew = true;
        let processProfile = this.processProfileService.getCloneData();
        processProfile.id = 0;
        processProfile = this.arrangeItems(processProfile);
        this.initForm(processProfile);
        this.materialChanged(true);
      }
      this.spinner.hide();
    }
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  arrangeItems(processProfile: any) {
    if (processProfile && (processProfile.processDimensionalPropertyList || []).length > 0) {
      let incrementIdx;
      processProfile.processDimensionalPropertyList.some((elem, i) => {
        const prop = elem.processDimensionalPropertyType || {};
        return (prop.name || '').toLowerCase().includes('tolerance increment expected')
          ? ((incrementIdx = i), true)
          : false;
      });
      let baseIdx;
      processProfile.processDimensionalPropertyList.some((elem, i) => {
        const prop = elem.processDimensionalPropertyType || {};
        return (prop.name || '').toLowerCase().includes('tolerance base expected') ? ((baseIdx = i), true) : false;
      });
      if (incrementIdx > -1 && baseIdx > -1) {
        const i = processProfile.processDimensionalPropertyList[baseIdx];
        processProfile.processDimensionalPropertyList[baseIdx] =
          processProfile.processDimensionalPropertyList[incrementIdx];
        processProfile.processDimensionalPropertyList[incrementIdx] = i;
      }
    }
    return processProfile;
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, form => {
      form.addEventListener(
        'submit',
        event => {
          this.submitClicked = true;
          this.checkInputValidationInTabs();
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            this.isFormValid = false;
          } else {
            this.isFormValid = true;
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  }

  getEquipment = () => (this.form.value.equipment != null ? [this.form.value.equipment] : []);
  getMaterials = () => this.form.value.materialList || [];

  get requiresProcessSpeed() {
    const hasPricingProfile = (this.rowData || []).length > 0;
    let requiredprocessPricingCondition = false;

    if (hasPricingProfile && (this.selectedProcessSpeedList || []).length === 0) {
      requiredprocessPricingCondition =
        this.rowData.filter(
          pricing =>
            (pricing.processPricingConditionList || []).filter(
              condition => condition.processPricingConditionType.name === 'Estimated Machine Time'
            ).length > 0
        ).length > 0;
    }
    return hasPricingProfile && requiredprocessPricingCondition;
  }

  get parameterNickName() {
    return this.form.value.parameterNickName || '';
  }

  get profileName() {
    let name = '';
    let materialList = [];
    const equipmentId = this.form.value.equipment || '';
    if (this.form.value.materialList) {
      materialList = this.getProperMaterialList();
    }
    if (equipmentId) {
      this.equipments.map(x => {
        if (x.id === equipmentId) {
          name += x.equipment.name;
        }
      });
    }
    if (materialList.length) {
      materialList.map(selectedMaterial => {
        this.materials.map(material => {
          if (material.id == selectedMaterial.machineServingMaterial.id) {
            name += material.material.name + ', ';
          }
        });
      });
    }

    return name;
  }

  get equipmentName() {
    let name = '';
    const equipmentId = this.form.value.equipment || '';
    if (equipmentId) {
      this.equipments.map(x => {
        if (x.id === equipmentId) {
          name += x.equipment.name;
        }
      });
    }
    return name;
  }

  get materialName() {
    let name = '';
    let materialList = [];
    if (this.form.value.materialList) {
      materialList = this.getProperMaterialList();
    }
    if (materialList.length) {
      materialList.map(selectedMaterial => {
        const materials = this.materials.filter(material => material.visible) || [];
        materials.map(material => {
          if (material.id == selectedMaterial.machineServingMaterial.id) {
            if (name.length > 1) {
              name += ', ' + material.material.name;
            } else {
              name += material.material.name;
            }
          }
        });
      });
    }
    return name;
  }

  get parameterDetails() {
    let name = '';
    this.selectedProcessParameterList.map(row => {
      if (row.operatorType.id && row.processParameterType.id && row.unitType.id && row.value) {
        const parameter = this.processParameterList.filter(item => item.id == row.processParameterType.id)[0];
        const parameterName = parameter.name;
        const operator = row.operandTypeList.filter(operand => operand.id == row.operatorType.id)[0];
        const unit = row.units.filter(unitItem => unitItem.id == row.unitType.id)[0];
        if (parameter && unit && operator) {
          const operatorSymbol = operator.symbol;
          if (name.length > 1) {
            if (operatorSymbol == '=') {
              name += ', ' + row.value + ' ' + unit.displayName + ' ' + parameterName;
            } else {
              name += ', ' + operatorSymbol + ' ' + +row.value + ' ' + unit.displayName + ' ' + parameterName;
            }
          } else {
            if (operatorSymbol == '=') {
              name += row.value + ' ' + unit.displayName + ' ' + parameterName;
            } else {
              name += operatorSymbol + ' ' + +row.value + ' ' + unit.displayName + ' ' + parameterName;
            }
          }
        }
      }
    });
    return name;
  }

  checkInputValidationInTabs() {
    const processParameterListStatus = [];
    const dimensionalPropertyListStatus = [];
    const materialCharacteristicListStatus = [];
    const processSpeedListStatus = [];
    this.selectedProcessParameterList.map((row, index) => {
      if (
        !row.operatorType.id ||
        !row.processParameterType.id ||
        !row.unitType.id ||
        // !row.value
        !(typeof row.value === 'number' && (row.value == 0 || row.value > 0))
      ) {
        processParameterListStatus.push(false);
      } else {
        processParameterListStatus.push(true);
      }
    });
    this.selectedProcessDimensionalPropertyList.map((row, index) => {
      if (
        !row.operatorType.id ||
        !row.processDimensionalPropertyType.id ||
        !row.unitType.id ||
        // !row.value
        !(typeof row.value === 'number' && (row.value == 0 || row.value > 0))
      ) {
        dimensionalPropertyListStatus.push(false);
      } else {
        dimensionalPropertyListStatus.push(true);
      }
    });
    this.selectedProcessMaterialCharacteristicList.map(row => {
      if (
        !row.operatorType.id ||
        !row.processMaterialCharacteristicType.id ||
        !row.unitType.id ||
        // !row.value
        !(typeof row.value === 'number' && (row.value == 0 || row.value > 0))
      ) {
        materialCharacteristicListStatus.push(false);
      } else {
        materialCharacteristicListStatus.push(true);
      }
    });
    this.selectedProcessSpeedList.map(row => {
      if (
        !row.operatorType.id ||
        !row.processSpeedType.id ||
        !row.unitType.id ||
        !(typeof row.value === 'number' && (row.value == 0 || row.value > 0))
      ) {
        processSpeedListStatus.push(false);
      } else {
        processSpeedListStatus.push(true);
      }
    });

    this.tabErrors.processParameter = processParameterListStatus.filter(x => x === false).length > 0;
    this.tabErrors.processDimensionalProperty = dimensionalPropertyListStatus.filter(x => x === false).length > 0;
    this.tabErrors.processMaterialCharacteristic = materialCharacteristicListStatus.filter(x => x === false).length > 0;
    this.tabErrors.processSpeedList = processSpeedListStatus.filter(x => x === false).length > 0;
  }

  onPropertyChange(conditionId, index, section, notInit = true) {
    let signTypeId = null;
    if (section === 'Process Parameters') {
      const operand = this.processParameterList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessParameterList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessParameterList[index].units = operand
        ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id)
        : [];

      if (notInit) {
        const defaultValue = operand
          ? this.defaultUnits.filter(item => item.measurementType.id == operand.measurementType.id)
          : [];
        this.selectedProcessParameterList[index].unitType.id = defaultValue.length ? defaultValue[0].id : '';
      }

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid =
        this.selectedProcessParameterList[index].units.filter(
          u => u.id == this.selectedProcessParameterList[index].unitType.id
        ).length > 0;
      if (!isSelectedUnitValid) {
        this.selectedProcessParameterList[index].unitType.id = '';
      }

      if (operandTypeName == 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name == 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name == 'positive')[0].id;
      }
      this.selectedProcessParameterList[index].valueSignType = {
        id: signTypeId
      };
    } else if (section === 'Process Dimensional Properties') {
      const operand = this.processDimensionalPropertyList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessDimensionalPropertyList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessDimensionalPropertyList[index].units = operand
        ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id)
        : [];

      if (notInit) {
        const defaultValue = this.defaultUnits.filter(item => item.measurementType.id == operand.measurementType.id);
        this.selectedProcessDimensionalPropertyList[index].unitType.id = defaultValue.length ? defaultValue[0].id : '';
      }

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid =
        this.selectedProcessDimensionalPropertyList[index].units.filter(
          u => u.id == this.selectedProcessDimensionalPropertyList[index].unitType.id
        ).length > 0;
      if (!isSelectedUnitValid) {
        this.selectedProcessDimensionalPropertyList[index].unitType.id = '';
      }

      if (operandTypeName === 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name === 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name === 'positive')[0].id;
      }
      this.selectedProcessDimensionalPropertyList[index].valueSignType = {
        id: signTypeId
      };
    } else if (section === 'Process Material Characteristics') {
      // tslint:disable-next-line:max-line-length
      const operand = this.processMaterialCharacteristicList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessMaterialCharacteristicList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessMaterialCharacteristicList[index].units = operand
        ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id)
        : [];

      if (notInit) {
        const defaultValue = operand
          ? this.defaultUnits.filter(item => item.measurementType.id == operand.measurementType.id)
          : [];
        this.selectedProcessMaterialCharacteristicList[index].unitType.id = defaultValue.length
          ? defaultValue[0].id
          : '';
      }

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid =
        this.selectedProcessMaterialCharacteristicList[index].units.filter(
          u => u.id == this.selectedProcessMaterialCharacteristicList[index].unitType.id
        ).length > 0;
      if (!isSelectedUnitValid) {
        this.selectedProcessMaterialCharacteristicList[index].unitType.id = '';
      }

      if (operandTypeName === 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name === 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name === 'positive')[0].id;
      }
      this.selectedProcessMaterialCharacteristicList[index].valueSignType = {
        id: signTypeId
      };
    } else if (section === 'Process Speed Properties') {
      // tslint:disable-next-line:max-line-length
      const operand = this.processSpeedList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessSpeedList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessSpeedList[index].units = operand
        ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id)
        : [];

      if (notInit) {
        const defaultValue = operand
          ? this.defaultUnits.filter(item => item.measurementType.id == operand.measurementType.id)
          : [];
        this.selectedProcessSpeedList[index].unitType.id = defaultValue.length ? defaultValue[0].id : '';
      }

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid =
        this.selectedProcessSpeedList[index].units.filter(u => u.id == this.selectedProcessSpeedList[index].unitType.id)
          .length > 0;
      if (!isSelectedUnitValid) {
        this.selectedProcessSpeedList[index].unitType.id = '';
      }

      if (operandTypeName === 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name === 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name === 'positive')[0].id;
      }
      this.selectedProcessSpeedList[index].valueSignType = {
        id: signTypeId
      };
    }
  }

  addCondition(section = this.activeTab) {
    const defOpt = {
      id: '',
      operatorType: {
        id: ''
      },
      unitType: {
        id: ''
      },
      value: '',
      valueInDefaultUnit: '',
      valueSignType: {
        id: ''
      },
      operandTypeList: [],
      units: []
    };
    switch (section) {
      case 'processParameterList':
        this.selectedProcessParameterList.push({
          ...defOpt,
          ...{ processParameterType: { id: '' } }
        });
        break;
      case 'processDimensionalPropertyList':
        this.selectedProcessDimensionalPropertyList.push({
          ...defOpt,
          ...{ processDimensionalPropertyType: { id: '' } }
        });
        break;
      case 'processMaterialCharacteristicList':
        this.selectedProcessMaterialCharacteristicList.push({
          ...defOpt,
          ...{ processMaterialCharacteristicType: { id: '' } }
        });
        break;
      case 'processSpeedList':
        this.selectedProcessSpeedList.push({
          ...defOpt,
          ...{ processSpeedType: { id: '' } }
        });
        break;
      default:
        break;
    }
  }

  removeCondition(index, section = this.activeTab) {
    switch (section) {
      case 'processParameterList':
        if (this.selectedProcessParameterList.length !== 0) {
          this.selectedProcessParameterList.splice(index, 1);
        }
        break;
      case 'processDimensionalPropertyList':
        if (this.selectedProcessDimensionalPropertyList.length !== 0) {
          this.selectedProcessDimensionalPropertyList.splice(index, 1);
        }
        break;
      case 'processMaterialCharacteristicList':
        if (this.selectedProcessMaterialCharacteristicList.length !== 0) {
          this.selectedProcessMaterialCharacteristicList.splice(index, 1);
        }
        break;
      case 'processSpeedList':
        if (this.selectedProcessSpeedList.length !== 0) {
          this.selectedProcessSpeedList.splice(index, 1);
        }
        break;
      default:
        break;
    }
  }

  toggleTab(tab, tabName) {
    this.checkInputValidationInTabs();
    this.activeTab = tab;
    this.activeTabName = tabName;
  }

  applyDefaults() {
    switch (this.activeTab) {
      case 'processParameterList':
        this.selectedProcessParameterList = this.defaultValues[this.activeTab];
        break;
      case 'processDimensionalPropertyList':
        this.selectedProcessDimensionalPropertyList = this.defaultValues[this.activeTab];
        break;
      case 'processMaterialCharacteristicList':
        this.selectedProcessMaterialCharacteristicList = this.defaultValues[this.activeTab];
        break;
      case 'processSpeedList':
        this.selectedProcessSpeedList = this.defaultValues[this.activeTab];
        break;
      default:
        break;
    }
    this.closeModal.nativeElement.click();
  }

  async getInputValues() {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = {
          size: 5000,
          sort: 'name,ASC',
          page,
          q: ''
        };
        const res = await this.machineService.getMachinery(this.vendorId, param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        page++;
      }
      rows.map((machine: any) => {
        machine.visible = !(this.equipments || []).some(e => e.equipment.id === machine.equipment.id);
        this.equipments.push(machine);
      });
    } catch (e) {
      console.log(e);
    }
  }

  equipmentChanged() {
    const machineId = this.form.value.equipment;
    this.form.setValue({ ...this.form.value, materialList: [] });
    this.materials = [];
    const machine = this.equipments.filter(m => m.id === machineId)[0];
    if (machine) {
      this.materials = [
        {
          id: 'all-materials',
          material: { name: 'All Materials' },
          visible: true
        }
      ];
      this.equipments.map(x => {
        if (machine.equipment.id === x.equipment.id) {
          (x.machineServingMaterialList || []).map(source => {
            source.visible = !this.materials.some(m => m.material.id === source.material.id);
            const result = source;
            result.material.name = this.htmlDecode(result.material.name);
            this.materials.push(result);
          });
        }
        if (Number(x.id) === Number(machineId)) {
          this.filteredProcessParameterList = this.processParameterList.filter(
            item => item.processType.name == x.equipment.processTypeName
          );
        }
      });
    }
  }

  materialChanged(editScreen = false) {
    if (!editScreen) {
      this.materialRemoved = false;
      this.equipmentRemoved = false;
    }

    const materialList = this.form.value.materialList;
    if (materialList.length) {
      if (editScreen && materialList.length === this.materials.length - 1) {
        this.form.setValue({
          ...this.form.value,
          materialList: ['all-materials']
        });
        return this.materials;
      } else {
        const lastInput = materialList[materialList.length - 1];
        if (lastInput === 'all-materials') {
          this.form.setValue({
            ...this.form.value,
            materialList: ['all-materials']
          });
          return this.materials;
        } else {
          if (materialList.includes('all-materials')) {
            const startIndex = materialList.indexOf('all-materials');
            const frontSlice = materialList.slice(0, startIndex);
            const endSlice = materialList.slice(startIndex + 1);
            this.form.setValue({
              ...this.form.value,
              materialList: [...frontSlice, ...endSlice]
            });
            return [...frontSlice, ...endSlice];
          }
        }
      }
    }
  }

  initForm(processProfile) {
    // tslint:disable-next-line:max-line-length
    let machine = null;
    if ((processProfile.processMachineServingMaterialList || []).length > 0) {
      const material = processProfile.processMachineServingMaterialList[0];
      if (
        material &&
        material.machineServingMaterial &&
        material.machineServingMaterial.vendorMachinery &&
        material.machineServingMaterial.vendorMachinery.equipment
      ) {
        machine = material.machineServingMaterial.vendorMachinery;
      }
    }
    const equipments = this.equipments.filter(machine => machine.equipment.id === machine.equipment.id);
    if (equipments.length > 1) {
      if (machine) {
        this.equipments.map(m => {
          if (m.equipment.id === machine.equipment.id) {
            m.visible = m.id === machine.id;
          }
        });
      }
    }
    this.form.setValue({
      id: processProfile.id,
      name: processProfile.name,
      parameterNickName: processProfile.parameterNickName,
      vendorId: processProfile.vendorId,
      equipment: machine ? machine.id : null,
      materialList: [],
      processParameterList: processProfile.processParameterList,
      processMaterialCharacteristicList: processProfile.processMaterialCharacteristicList,
      processDimensionalPropertyList: processProfile.processDimensionalPropertyList,
      processSpeedList: processProfile.processSpeedList
    });

    this.equipmentChanged();
    const mList = [];
    let duplicate = [];
    processProfile.processMachineServingMaterialList.map(x => {
      if (!mList.some(m => m.machineServingMaterial.material.id === x.machineServingMaterial.material.id)) {
        mList.push(x);
      } else {
        duplicate.push(x.machineServingMaterial);
      }
    });
    this.materials
      .filter(x => x.id !== 'all-materials')
      .map(m => {
        if (duplicate.some(x => x.material.id === m.material.id)) {
          const item = duplicate.filter(i => i.material.id === m.material.id && i.id === m.id);
          m.visible = !(item.length > 0);
        }
      });
    this.form.setValue({
      ...this.form.value,
      materialList: [...mList.map(x => x.machineServingMaterial.id)]
    });
    this.selectedProcessParameterList = [
      ...processProfile.processParameterList.map(x => {
        x.operandTypeList = [];
        return x;
      })
    ];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessMaterialCharacteristicList = [
      ...processProfile.processMaterialCharacteristicList.map(x => {
        x.operandTypeList = [];
        return x;
      })
    ];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessDimensionalPropertyList = [
      ...processProfile.processDimensionalPropertyList.map(x => {
        x.operandTypeList = [];
        return x;
      })
    ];
    this.selectedProcessSpeedList = [
      ...processProfile.processSpeedList.map(x => {
        x.operandTypeList = [];
        return x;
      })
    ];

    this.selectedProcessParameterList.map((parameter, index) => {
      this.onPropertyChange(parameter.processParameterType.id, index, 'Process Parameters', false);
    });
    this.selectedProcessMaterialCharacteristicList.map((parameter, index) => {
      this.onPropertyChange(
        parameter.processMaterialCharacteristicType.id,
        index,
        'Process Material Characteristics',
        false
      );
    });
    this.selectedProcessDimensionalPropertyList.map((parameter, index) => {
      this.onPropertyChange(
        parameter.processDimensionalPropertyType.id,
        index,
        'Process Dimensional Properties',
        false
      );
    });
    this.selectedProcessSpeedList.map((parameter, index) => {
      this.onPropertyChange(parameter.processSpeedType.id, index, 'Process Speed Properties', false);
    });

    const equipmentFound = this.equipments.filter(equipment => equipment.id == this.form.value.equipment);
    const materialFound = this.materials.filter(material => this.form.value.materialList.includes(material.id));

    if (!(materialFound.length > 0)) {
      this.form.setValue({ ...this.form.value, materialList: [] });
      this.materialRemoved = !(materialFound.length > 0);
    }

    if (!(equipmentFound.length > 0)) {
      this.form.setValue({ ...this.form.value, equipment: null });
      this.equipmentRemoved = !(equipmentFound.length > 0);
    }
  }

  getProperMaterialList() {
    const materialList = this.form.value.materialList || [];
    if (materialList.length) {
      if (materialList.includes('all-materials')) {
        const materials = this.materials.map(x => new Object({ machineServingMaterial: { id: x.id } }));
        return materials.filter((mat: any) => mat.machineServingMaterial.id !== 'all-materials');
      }
      const materials = this.materials
        .filter(m => m.id !== 'all-materials')
        .reduce((acc: any, value: any) => {
          acc[value.material.id] = acc[value.material.id] || [];
          if (acc[value.material.id]) {
            acc[value.material.id].push(value.id);
          }
          return acc;
        }, {});
      const arr = [];
      for (let material in materials) {
        if (materials.hasOwnProperty(material) && materials[material].length > 0) {
          materialList.map(m => {
            if (materials[material].indexOf(m) > -1) {
              materials[material].map(x => arr.push(Object({ machineServingMaterial: { id: x } })));
            }
          });
        }
      }
      return arr;
    }
    return [];
  }

  prepareData() {
    let name = this.equipmentName + ' - ' + this.materialName;
    if ((this.form.value.parameterNickName || '').length > 0) {
      name += ' - ' + this.form.value.parameterNickName;
    }
    const postData = {
      parameterNickName: this.form.value.parameterNickName,
      name,
      processMachineServingMaterialList: [...this.getProperMaterialList()],
      // machineServingMaterial: { id: this.form.value.materialList },
      processParameterList: [...this.selectedProcessParameterList],
      processDimensionalPropertyList: [...this.selectedProcessDimensionalPropertyList],
      processMaterialCharacteristicList: [...this.selectedProcessMaterialCharacteristicList],
      processSpeedList: [...this.selectedProcessSpeedList],
      processProfileType: {
        id: 1
      }
    };
    return postData;
  }

  save(event, isCloneProfile: boolean = false, addPricingProfile = false) {
    event.preventDefault();
    this.submitActive = false;
    setTimeout(async () => {
      this.checkInputValidationInTabs();
      const isValidForm = isCloneProfile ? this.form.valid : this.form.valid && this.isFormValid;
      if (
        isValidForm &&
        !this.tabErrors.processParameter &&
        !this.tabErrors.processDimensionalProperty &&
        !this.tabErrors.processMaterialCharacteristic &&
        !this.tabErrors.processSpeedList
      ) {
        this.error = '';
        const vendorId = this.vendorId;
        const postData = this.prepareData();

        if (this.isNew) {
          this.spinner.show();
          try {
            const serverData = await this.processProfileService.saveProfile(vendorId, postData).toPromise();

            let gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/profile')) + '/profile';
            if (isCloneProfile) {
              this.processProfileService.storeCloneData(serverData);
              gotoURL = gotoURL + `/clone`;
            }

            this.route.navigateByUrl(gotoURL, {
              state: {
                toast: { type: 'success', body: 'Process Profile Saved!' }
              }
            });
          } catch (e) {
            if (e.error && e.error.message) {
              this.error = e.error.message;
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
            this.submitActive = true;
          }
        } else {
          this.spinner.show();
          try {
            const serverData = await this.processProfileService
              .updateProfile(vendorId, this.processProfileId, postData)
              .toPromise();

            if (addPricingProfile) {
              let gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/profile')) + '/profile';
              this.route.navigateByUrl(`${gotoURL}/add`, {
                state: {
                  selectedProcessProfileId: this.processProfileId
                }
              });
            } else {
              let gotoURL = this.route.url.substr(0, this.route.url.lastIndexOf('/profile')) + '/profile';
              if (isCloneProfile) {
                this.processProfileService.storeCloneData(serverData);
                gotoURL = `${gotoURL}/clone`;
                this.route.navigateByUrl(gotoURL, {
                  state: {
                    toast: {
                      type: 'success',
                      body: 'Process Profile Created!'
                    }
                  }
                });
              } else {
                this.route.navigateByUrl(gotoURL, {
                  state: {
                    toast: { type: 'success', body: 'Process Profile Edited!' }
                  }
                });
              }
            }
          } catch (e) {
            console.log(e);
            if (e.error && e.error.message) {
              this.error = e.error.message;
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
            this.submitActive = true;
          }
        }
      } else {
        this.submitActive = true;
      }
    }, 100);
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

  getProcessSpeedOperandType(index) {
    if (this.selectedProcessSpeedList[index].processSpeedType.id === '5') {
      return this.selectedProcessSpeedList[index].operandTypeList.filter(type => [3, 5, 1].includes(type.id));
    } else {
      return this.selectedProcessSpeedList[index].operandTypeList.filter(type => [2, 4, 1].includes(type.id));
    }
  }
  getProcessParameterList(index) {
    if (this.selectedProcessParameterList[index].processParameterType.id === '4') {
      return this.selectedProcessParameterList[index].operandTypeList.filter(type => [2, 4, 1].includes(type.id));
    }
    return this.selectedProcessParameterList[index].operandTypeList;
  }

  htmlDecode(input) {
    const str = input;
    return str.replace(/&/g, ' and ').replace(/&amp;/g, ' and ');
  }
}
