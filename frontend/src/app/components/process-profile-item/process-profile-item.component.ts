import { Component, OnInit, AfterViewChecked, Input, ElementRef, ViewChild } from '@angular/core';

import * as processProfiles from '../../../assets/static/processProfile';
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

@Component({
  selector: 'app-process-profile-item',
  templateUrl: './process-profile-item.component.html',
  styleUrls: ['./process-profile-item.component.css']
})
export class ProcessProfileItemComponent implements OnInit, AfterViewChecked {

  @ViewChild('closeModal') closeModal: ElementRef;
  facilities = [];
  equipments = [];
  materials = [];
  submitActive = true;
  submitClicked = false;

  tabErrors = {
    processParameter: false,
    processDimensionalProperty: false,
    processMaterialCharacteristic: false
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
    processParameterList: [
      []
    ],
    processDimensionalPropertyList: [
      []
    ],
    processMaterialCharacteristicList: [
      []
    ],
  });

  processParameterList = [];
  processDimensionalPropertyList = [];
  processMaterialCharacteristicList = [];
  signTypes = [];
  units = [];
  conditions = {};

  selectedProcessParameterList = [
    {
      id: '',
      operatorType: {
        id: ''
      },
      processParameterType: {
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
    }
  ];
  selectedProcessDimensionalPropertyList = [];
  selectedProcessMaterialCharacteristicList = [];


  processProfileId = null;
  processProfiles = processProfiles;

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

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaData: ProcessMetadataService,
    public processProfileService: ProcessProfileService,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show();

      await this.getInputValues();

      const processParameterType = await this.processMetaData.getProcessParameterType().toPromise();
      const processDimensionalPropertyType = await this.processMetaData.getProcessDimensionalPropertyType().toPromise();
      const processMaterialCharacteristicType = await this.processMetaData.getProcessMaterialCharacteristicType().toPromise();
      const operatorType = await this.processMetaData.getoperatorType().toPromise();
      const signType = await this.processMetaData.getValueSignType().toPromise();
      const units = await this.processMetaData.getMeasurementUnitType().toPromise();

      operatorType.metadataList.map(operator => {
        const addedList = Object.keys(this.conditions);
        if (addedList.includes(operator.operandType.name)) {
          this.conditions[operator.operandType.name].push(operator);
        } else {
          this.conditions[operator.operandType.name] = [operator];
        }
      });

      this.units = units.metadataList;
      this.signTypes = signType.metadataList;

      this.processParameterList = processParameterType.metadataList;
      this.processDimensionalPropertyList = processDimensionalPropertyType.metadataList;
      this.processMaterialCharacteristicList = processMaterialCharacteristicType.metadataList;

      // console.log({
      //   conditions: this.conditions,
      //   processParameterList: this.processParameterList,
      //   processDimensionalPropertyList: this.processDimensionalPropertyList,
      //   processMaterialCharacteristicList: this.processMaterialCharacteristicList,
      // });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

    if (this.route.url.includes('edit')) {
      this.spinner.show();
      this.isNew = false;
      this.processProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      // tslint:disable-next-line:max-line-length
      const processProfile = await this.processProfileService.getProfile(this.userService.getVendorInfo().id, this.processProfileId).toPromise();
      this.initForm(processProfile);
      this.materialChanged(true);
      this.spinner.hide();
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
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
      }, false);
    });
  }

  getEquipment = () => this.form.value.equipment != null ? [this.form.value.equipment] : [];
  getMaterials = () => this.form.value.materialList || [];

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
        this.materials.map(material => {
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
      if (
        row.operatorType.id &&
        row.processParameterType.id &&
        row.unitType.id &&
        row.value
      ) {
        const parameter = this.processParameterList.filter(item => item.id == row.processParameterType.id)[0];
        const parameterName = parameter.name;
        const operator = row.operandTypeList.filter(operand => operand.id == row.operatorType.id)[0];
        const unit = row.units.filter(unitItem => unitItem.id == row.unitType.id)[0];
        if (parameter && unit && operator) {
          const operatorSymbol = operator.symbol;

          if (name.length > 1) {
            if (operatorSymbol == '=') {
              name += ', ' + row.value + ' ' + unit.symbol + ' ' + parameterName;
            } else {
              name += ', ' + operatorSymbol + ' ' + + row.value + ' ' + unit.symbol + ' ' + parameterName;
            }
          } else {
            if (operatorSymbol == '=') {
              name += row.value + ' ' + unit.symbol + ' ' + parameterName;
            } else {
              name += operatorSymbol + ' ' + + row.value + ' ' + unit.symbol + ' ' + parameterName;
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

    this.selectedProcessParameterList.map((row, index) => {
      if (
        !row.operatorType.id ||
        !row.processParameterType.id ||
        !row.unitType.id ||
        !row.value
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
        !row.value
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
        !row.value
      ) {
        materialCharacteristicListStatus.push(false);
      } else {
        materialCharacteristicListStatus.push(true);
      }
    });

    this.tabErrors.processParameter = processParameterListStatus.filter(x => x === false).length > 0;
    this.tabErrors.processDimensionalProperty = dimensionalPropertyListStatus.filter(x => x === false).length > 0;
    this.tabErrors.processMaterialCharacteristic = materialCharacteristicListStatus.filter(x => x === false).length > 0;


  }

  onPropertyChange(conditionId, index, section) {
    let signTypeId = null;
    if (section === 'Process Parameters') {
      const operand = this.processParameterList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessParameterList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessParameterList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];

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
      this.selectedProcessDimensionalPropertyList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];

      if (operandTypeName == 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name == 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name == 'positive')[0].id;
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
      this.selectedProcessMaterialCharacteristicList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];

      if (operandTypeName == 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name == 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name == 'positive')[0].id;
      }
      this.selectedProcessMaterialCharacteristicList[index].valueSignType = {
        id: signTypeId
      };
    }

  }


  addCondition(section = this.activeTab) {
    switch (section) {
      case 'processParameterList':
        this.selectedProcessParameterList.push(
          {
            id: '',
            operatorType: {
              id: ''
            },
            processParameterType: {
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
          }
        );
        break;
      case 'processDimensionalPropertyList':
        this.selectedProcessDimensionalPropertyList.push(
          {
            id: '',
            operatorType: {
              id: ''
            },
            processDimensionalPropertyType: {
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
          }
        );
        break;
      case 'processMaterialCharacteristicList':
        this.selectedProcessMaterialCharacteristicList.push(
          {
            id: '',
            operatorType: {
              id: ''
            },
            processMaterialCharacteristicType: {
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
          }
        );
        break;
      default:
        break;
    }
  }

  removeCondition(index, section = this.activeTab) {
    let frontSlice = [];
    let endSlice = [];
    switch (section) {
      case 'processParameterList':
        if (this.selectedProcessParameterList.length !== 1) {
          frontSlice = this.selectedProcessParameterList.slice(0, index);
          endSlice = this.selectedProcessParameterList.slice(index + 1);
          this.selectedProcessParameterList = frontSlice.concat(endSlice);
        }
        break;
      case 'processDimensionalPropertyList':
        if (this.selectedProcessParameterList.length !== 0) {
          frontSlice = this.selectedProcessDimensionalPropertyList.slice(0, index);
          endSlice = this.selectedProcessDimensionalPropertyList.slice(index + 1);
          this.selectedProcessDimensionalPropertyList = frontSlice.concat(endSlice);
        }
        break;
      case 'processMaterialCharacteristicList':
        if (this.selectedProcessParameterList.length !== 0) {
          frontSlice = this.selectedProcessMaterialCharacteristicList.slice(0, index);
          endSlice = this.selectedProcessMaterialCharacteristicList.slice(index + 1);
          this.selectedProcessMaterialCharacteristicList = frontSlice.concat(endSlice);
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
      default:
        break;
    }
    console.log(this.form);
    this.closeModal.nativeElement.click();
  }


  async getInputValues() {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 5000, sort: 'name,ASC', page, q: '' };
        const res = await this.machineService.getMachinery(this.userService.getVendorInfo().id, param).toPromise();
        if (!res.content || res.content.length == 0) {
          break;
        }
        rows.push(...res.content);
        page++;
      }
      rows.map(machine => {
        this.equipments.push(machine);
      });
    } catch (e) {
      console.log(e);
    }
  }

  equipmentChanged() {
    const equipmentId = this.form.value.equipment;
    this.form.setValue({ ...this.form.value, materialList: [] });
    this.materials = [];
    this.equipments.map(x => {
      if (x.id == equipmentId) {
        this.materials = [{ id: 'all-materials', material: { name: 'All Materials' } }, ...x.machineServingMaterialList];
        this.filteredProcessParameterList = this.processParameterList.filter(item => item.processType.name == x.equipment.processTypeName);
      }
    });
  }

  materialChanged(editScreen = false) {
    const materialList = this.form.value.materialList;
    if (materialList.length) {

      if (editScreen && materialList.length == this.materials.length - 1) {
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
    this.form.setValue({
      id: processProfile.id,
      name: processProfile.name,
      parameterNickName: processProfile.parameterNickName,
      vendorId: processProfile.vendorId,
      // tslint:disable-next-line:max-line-length
      equipment: processProfile.processMachineServingMaterialList[0] ? processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.id : '',
      materialList: [],
      processParameterList: processProfile.processParameterList,
      processMaterialCharacteristicList: processProfile.processMaterialCharacteristicList,
      processDimensionalPropertyList: processProfile.processDimensionalPropertyList
    });

    this.equipmentChanged();
    this.form.setValue({
      ...this.form.value, materialList: [...processProfile.processMachineServingMaterialList.map(x => x.machineServingMaterial.id)]
    });
    this.selectedProcessParameterList = [...processProfile.processParameterList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessMaterialCharacteristicList = [...processProfile.processMaterialCharacteristicList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessDimensionalPropertyList = [...processProfile.processDimensionalPropertyList.map(x => { x.operandTypeList = []; return x; })];

    // console.log({
    //   selectedProcessDimensionalPropertyList: this.selectedProcessDimensionalPropertyList,
    //   selectedProcessMaterialCharacteristicList: this.selectedProcessMaterialCharacteristicList,
    //   selectedProcessParameterList: this.selectedProcessParameterList,
    // });
    this.selectedProcessParameterList.map((parameter, index) => {
      this.onPropertyChange(parameter.processParameterType.id, index, 'Process Parameters');
    });
    this.selectedProcessMaterialCharacteristicList.map((parameter, index) => {
      this.onPropertyChange(parameter.processMaterialCharacteristicType.id, index, 'Process Material Characteristics');
    });
    this.selectedProcessDimensionalPropertyList.map((parameter, index) => {
      this.onPropertyChange(parameter.processDimensionalPropertyType.id, index, 'Process Dimensional Properties');
    });
  }

  getProperMaterialList() {
    const materialList = this.form.value.materialList;
    if (materialList.length) {
      if (materialList.includes('all-materials')) {
        const materials = this.materials.map(x => new Object({ machineServingMaterial: { id: x.id } }));
        return materials.filter((mat: any) => mat.machineServingMaterial.id !== 'all-materials');
      }
      return this.form.value.materialList.map(x => new Object({ machineServingMaterial: { id: x } }));
    }
    return [];
  }

  prepareData() {
    const postData = {
      parameterNickName: this.form.value.parameterNickName,
      name: this.equipmentName + ' - ' + this.materialName,
      processMachineServingMaterialList: [...this.getProperMaterialList()],
      // machineServingMaterial: { id: this.form.value.materialList },
      processParameterList: [...this.selectedProcessParameterList],
      processDimensionalPropertyList: [...this.selectedProcessDimensionalPropertyList],
      processMaterialCharacteristicList: [...this.selectedProcessMaterialCharacteristicList],
      processProfileType: {
        id: 1
      }
    };
    return postData;
  }

  save(event) {
    event.preventDefault();
    this.submitActive = false;
    setTimeout(async () => {
      if (this.form.valid && this.isFormValid) {
        this.error = '';
        const vendorId = this.userService.getVendorInfo().id;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            await this.processProfileService.saveProfile(vendorId, postData).toPromise();
            const gotoURL = `/profile/processes/profile`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Process Profile Saved!' } } });
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
            await this.processProfileService.updateProfile(vendorId, this.processProfileId, postData).toPromise();
            const gotoURL = `/profile/processes/profile`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Process Profile Edited!' } } });
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

}
