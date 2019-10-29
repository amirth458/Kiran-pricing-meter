import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

import * as postProcessProfile from '../../../assets/static/postProcessProfile';
import { Router } from '@angular/router';
import { FilterOption } from 'src/app/model/vendor.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { PostProcessProfileService } from 'src/app/service/post-process-profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { MachineService } from 'src/app/service/machine.service';
import { MaterialService } from 'src/app/service/material.service';
import { EquipmentService } from 'src/app/service/equipment.service';
import { disableBindings } from '@angular/core/src/render3';

@Component({
  selector: 'app-post-process-profile-item',
  templateUrl: './post-process-profile-item.component.html',
  styleUrls: ['./post-process-profile-item.component.css']
})
export class PostProcessProfileItemComponent implements OnInit, AfterViewChecked {

  facilities = [];
  equipments = [];
  materials = [];
  familyOptions = [];
  actionOptions = [];
  submitActive = true;
  triedToSubmit = false;

  tabErrors = {
    processParameter: false,
    processDimensionalProperty: false,
    processMaterialCharacteristic: false
  };

  form: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null],
    name: [null],
    parameterNickName: [null],
    equipment: ['', Validators.required],
    materialList: [null, Validators.required],
    postProcessProfileFamily: [''],
    // postProcessAction: ['', Validators.required],
    postProcessAction: [''],
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

  filteredProcessParameterList = [];
  filteredProcessDimensionalPropertyList = [];
  filteredProcessMaterialCharacteristicList = [];

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


  postProcessProfileId = null;

  activeTab = 'processDimensionalPropertyList';
  activeTabName = 'Post-Process Dimensional Properties';
  error = '';
  isNew = true;
  isFormValid = false;
  operatorId = null;

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaData: ProcessMetadataService,
    public postProcessProfileService: PostProcessProfileService,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService
  ) { }

  async ngOnInit() {
    this.form.controls.postProcessProfileFamily.disable();
    this.form.controls.postProcessAction.disable();

    try {
      this.spinner.show();

      await this.getInputValues();

      const processParameterType = await this.processMetaData.getProcessParameterType(true).toPromise();
      const processDimensionalPropertyType = await this.processMetaData.getProcessDimensionalPropertyType(true).toPromise();
      const processMaterialCharacteristicType = await this.processMetaData.getProcessMaterialCharacteristicType(true).toPromise();
      const operatorType = await this.processMetaData.getoperatorType(true).toPromise();
      const signType = await this.processMetaData.getValueSignType(true).toPromise();
      const units = await this.processMetaData.getMeasurementUnitType(true).toPromise();

      operatorType.metadataList.map(operator => {
        const addedList = Object.keys(this.conditions);

        if (operator.symbole == '=' || operator.name == 'is equal to') {
          this.operatorId = operator.id;
        }

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

    } catch (e) {
      console.log(e);
    } finally {


      if (this.route.url.includes('edit')) {
        this.spinner.show();
        this.isNew = false;
        this.postProcessProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
        // tslint:disable-next-line:max-line-length
        const processProfile = await this.postProcessProfileService.getProfile(this.userService.getVendorInfo().id, this.postProcessProfileId).toPromise();
        this.initForm(processProfile);
      }
      this.spinner.hide();
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
        this.triedToSubmit = true;
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

  getMaterials = () => this.form.value.materialList != null ? this.form.value.materialList : [];
  get parameterNickName() {
    return this.form.value.parameterNickName || '';
  }
  get profileName() {
    let name = '';
    let equipmentName = '';
    const materialList = this.getMaterials();

    if (this.form.value.equipment) {
      this.equipments.map(equipment => {
        if (equipment.id == this.form.value.equipment) {
          equipmentName = equipment.equipment.name;
        }
      });
    }
    name += equipmentName;
    if (materialList.length) {
      materialList.map(selectedMaterial => {
        this.materials.map(material => {
          if (material.id == selectedMaterial) {
            name += ' - ' + material.material.name;
          }
        });
      });
    }

    return name;
  }

  get processActionName() {
    return this.form.value.postProcessAction || '';
  }

  get equipmentName() {
    let name = '';
    const equipmentId = this.form.value.equipment || '';
    if (equipmentId) {
      this.equipments.map(x => {
        if (x.id.toString() === equipmentId) {
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
    this.selectedProcessParameterList.map((row, index) => {
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
              name += ', ' + row.value + ' ' + unit.displayName + ' ' + parameterName;
            } else {
              name += ', ' + operatorSymbol + ' ' + + row.value + ' ' + unit.displayName + ' ' + parameterName;
            }
          } else {
            if (operatorSymbol == '=') {
              name += row.value + ' ' + unit.displayName + ' ' + parameterName;
            } else {
              name += operatorSymbol + ' ' + + row.value + ' ' + unit.displayName + ' ' + parameterName;
            }
          }
        }
      }
    });
    return name;
  }

  checkInputValidationInTabs() {
    const dimensionalPropertyListStatus = [];
    const materialCharacteristicListStatus = [];
    this.selectedProcessDimensionalPropertyList.map((row, index) => {
      if (
        !row.operatorType.id ||
        !row.processDimensionalPropertyType.id ||
        !row.unitType.id ||
        (
          !row.beforeMinValue &&
          !row.beforeMaxValue &&
          !row.afterMinValue &&
          !row.afterExpectedValue &&
          !row.afterMaxValue)
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
        (
          !row.beforeMinValue &&
          !row.beforeMaxValue &&
          !row.afterMinValue &&
          !row.afterExpectedValue &&
          !row.afterMaxValue)
      ) {
        materialCharacteristicListStatus.push(false);
      } else {
        materialCharacteristicListStatus.push(true);
      }
    });

    this.tabErrors.processDimensionalProperty = dimensionalPropertyListStatus.filter(x => x === false).length > 0;
    this.tabErrors.processMaterialCharacteristic = materialCharacteristicListStatus.filter(x => x === false).length > 0;


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

  getProperOperands(conditionId, index, section) {
    let signTypeId = null;

    if (section === 'Post-Process Parameters') {
      // tslint:disable-next-line:max-line-length
      const operand = this.processParameterList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessParameterList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessParameterList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid = this.selectedProcessParameterList[index].units.filter(u => u.id == this.selectedProcessParameterList[index].unitType.id).length > 0;
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

    } else if (section === 'Post-Process Dimensional Properties') {
      // tslint:disable-next-line:max-line-length
      const operand = this.processDimensionalPropertyList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessDimensionalPropertyList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessDimensionalPropertyList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid = this.selectedProcessDimensionalPropertyList[index].units.filter(u => u.id == this.selectedProcessDimensionalPropertyList[index].unitType.id).length > 0;
      if (!isSelectedUnitValid) {
        this.selectedProcessDimensionalPropertyList[index].unitType.id = '';
      }

      if (operandTypeName == 'absolute') {
        signTypeId = this.signTypes.filter(x => x.name == 'absolute')[0].id;
      } else {
        signTypeId = this.signTypes.filter(x => x.name == 'positive')[0].id;
      }
      this.selectedProcessDimensionalPropertyList[index].valueSignType = {
        id: signTypeId
      };
    } else if (section === 'Post-Process Material Characteristics') {
      // tslint:disable-next-line:max-line-length
      const operand = this.processMaterialCharacteristicList.filter(condition => condition.id == conditionId)[0];
      const operandTypeName = operand ? operand.operandType.name : null;
      const options = operandTypeName ? this.conditions[operandTypeName.toString()] : [];
      this.selectedProcessMaterialCharacteristicList[index].operandTypeList = options;
      // tslint:disable-next-line:max-line-length
      this.selectedProcessMaterialCharacteristicList[index].units = operand ? this.units.filter(unit => unit.measurementType.id == operand.measurementType.id) : [];

      // tslint:disable-next-line:max-line-length
      const isSelectedUnitValid = this.selectedProcessMaterialCharacteristicList[index].units.filter(u => u.id == this.selectedProcessMaterialCharacteristicList[index].unitType.id).length > 0;
      if (!isSelectedUnitValid) {
        this.selectedProcessMaterialCharacteristicList[index].unitType.id = '';
      }

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

            beforeMinValue: '',
            beforeMaxValue: '',
            afterMinValue: '',
            afterExpectedValue: '',
            afterMaxValue: '',

            operatorType: {
              id: this.operatorId || 1
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
            unit: []
          });

        break;
      case 'processMaterialCharacteristicList':
        this.selectedProcessMaterialCharacteristicList.push(
          {
            id: '',

            beforeMinValue: '',
            beforeMaxValue: '',
            afterMinValue: '',
            afterExpectedValue: '',
            afterMaxValue: '',

            operatorType: {
              id: this.operatorId || 1
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
            unit: []
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
    this.checkInputValidationInTabs();
  }

  toggleTab(tab, tabName) {
    this.checkInputValidationInTabs();
    this.activeTab = tab;
    this.activeTabName = tabName;
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

  getSelectedEquipment() {
    return this.form.value.equipment;
  }

  equipmentChanged(processProfile?) {
    const equipmentId = this.form.value.equipment;

    const pmsmList = processProfile.processMachineServingMaterialList.filter(x => {
      const index = this.materials.findIndex(y => y.id === x.machineServingMaterial.id);
      return index >= 0;
    });


    if (processProfile) {
      this.form.setValue({
        ...this.form.value,
        postProcessProfileFamily: '-',
        postProcessAction: processProfile.processAction ? processProfile.processAction.id || '' : '',
        materialList: [...pmsmList.map(x => x.machineServingMaterial.id)],
      });
    } else {
      this.form.setValue({
        ...this.form.value,
        postProcessProfileFamily: '-',
        postProcessAction: '',
        materialList: []
      });
    }
    this.equipments.map(async (x) => {
      if (x.id == equipmentId) {
        this.materials = x.machineServingMaterialList;
        this.familyOptions = [x.equipment.processFamily];
        const machine = await this.machineService.getMachine(this.userService.getVendorInfo().id, x.id).toPromise();
        const processTypeName = machine.equipment.processTypeName;
        this.actionOptions = machine.equipment.processFamily.processAction;


        this.filteredProcessParameterList = this.processParameterList.filter(x => x.processType.name == processTypeName);
        this.filteredProcessDimensionalPropertyList = this.processDimensionalPropertyList;
        this.filteredProcessMaterialCharacteristicList = this.processMaterialCharacteristicList;

        this.form.setValue({
          ...this.form.value,
          postProcessAction: processProfile ? processProfile.processAction ? processProfile.processAction.id || '' : '' : '',
          postProcessProfileFamily: x.equipment.processFamily.id
        });
      }
      if (this.actionOptions.length == 0) {
        this.form.controls.postProcessAction.disable();
      } else {
        this.form.controls.postProcessAction.enable();
      }
    });

  }

  async initForm(processProfile) {
    const machineId = processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.id;
    this.familyOptions = [{
      id: processProfile.processMachineServingMaterialList[0].machineServingMaterial.materialFamilyName,
      name: processProfile.processMachineServingMaterialList[0].machineServingMaterial.materialFamilyName
    }];
    const machine = await this.machineService.getMachine(this.userService.getVendorInfo().id, machineId).toPromise();
    this.actionOptions = machine.equipment.processFamily.processAction;

    this.triedToSubmit = true;
    const pmsmList = processProfile.processMachineServingMaterialList.filter(x => {
      const index = this.materials.findIndex(y => y.id === x.machineServingMaterial.id);
      return index >= 0;
    });

    this.form.setValue({
      id: processProfile.id,
      name: processProfile.name,
      parameterNickName: processProfile.parameterNickName,
      vendorId: processProfile.vendorId,
      postProcessProfileFamily: machine.equipment.processFamily.id,
      postProcessAction: processProfile.processAction ? processProfile.processAction.id || '' : '',
      // tslint:disable-next-line:max-line-length
      equipment: processProfile.processMachineServingMaterialList[0] ? processProfile.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.id : '',
      materialList: [...pmsmList.map(x => x.machineServingMaterial.id)],
      processParameterList: processProfile.processParameterList,
      processMaterialCharacteristicList: processProfile.processMaterialCharacteristicList,
      processDimensionalPropertyList: processProfile.processDimensionalPropertyList
    });

    this.equipmentChanged(processProfile);

    this.selectedProcessParameterList = [...processProfile.processParameterList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessMaterialCharacteristicList = [...processProfile.processMaterialCharacteristicList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessDimensionalPropertyList = [...processProfile.processDimensionalPropertyList.map(x => { x.operandTypeList = []; return x; })];

    // this.selectedProcessParameterList.map((row, index) => {
    //   console.log(row.id);
    //   const isPropertyValid = this.filteredProcessParameterList.filter(param => param.id == row.id).length > 0
    //   if (!isPropertyValid) {
    //     this.selectedProcessParameterList[index].processParameterType.id = '';
    //   }
    // });


    // this.selectedProcessDimensionalPropertyList.map((row, index) => {
    //   const isPropertyValid = this.filteredProcessDimensionalPropertyList.filter(param => param.id == row.id).length > 0
    //   if (!isPropertyValid) {
    //     this.selectedProcessDimensionalPropertyList[index].processDimensionalPropertyType.id = '';
    //   }
    // });

    // this.selectedProcessMaterialCharacteristicList.map((row, index) => {
    //   const isPropertyValid = this.filteredProcessMaterialCharacteristicList.filter(param => param.id == row.id).length > 0
    //   if (!isPropertyValid) {
    //     this.selectedProcessMaterialCharacteristicList[index].processMaterialCharacteristicType.id = '';
    //   }
    // });


    this.selectedProcessParameterList.map((parameter, index) => {
      this.getProperOperands(parameter.processParameterType.id, index, 'Post-Process Parameters');
    });
    this.selectedProcessMaterialCharacteristicList.map((parameter, index) => {
      this.getProperOperands(parameter.processMaterialCharacteristicType.id, index, 'Post-Process Material Characteristics');
    });
    this.selectedProcessDimensionalPropertyList.map((parameter, index) => {
      this.getProperOperands(parameter.processDimensionalPropertyType.id, index, 'Post-Process Dimensional Properties');
    });
  }

  prepareData() {
    const postData = {
      name: this.profileName,
      parameterNickName: this.form.value.parameterNickName,
      // machineServingMaterial: { id: this.form.value.material },
      processMachineServingMaterialList: this.form.value.materialList.map(x => new Object({ machineServingMaterial: { id: x } })),
      processParameterList: [...this.selectedProcessParameterList],
      processDimensionalPropertyList: [...this.selectedProcessDimensionalPropertyList],
      processMaterialCharacteristicList: [...this.selectedProcessMaterialCharacteristicList],
      processProfileType: {
        id: 2
      },
      processAction: {
        id: this.form.value.postProcessAction
      }
    };
    return postData;
  }

  save(event) {
    event.preventDefault();
    this.submitActive = false;
    console.log(this.form.value)
    setTimeout(async () => {
      this.checkInputValidationInTabs();
      if (
        this.form.valid &&
        this.isFormValid &&
        !this.tabErrors.processParameter &&
        !this.tabErrors.processDimensionalProperty &&
        !this.tabErrors.processMaterialCharacteristic
      ) {
        this.error = '';
        const vendorId = this.userService.getVendorInfo().id;
        const postData = this.prepareData();

        if (this.isNew) {
          this.spinner.show();
          try {
            await this.postProcessProfileService.saveProfile(vendorId, postData).toPromise();
            const gotoURL = `/profile/post-processes/profile`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Post-Process Profile Created!' } } });
          } catch (e) {
            if (e.error && e.error.message) {
              this.error = e.error.message;
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
          }
        } else {
          this.spinner.show();
          try {
            await this.postProcessProfileService.updateProfile(vendorId, this.postProcessProfileId, postData).toPromise();
            const gotoURL = `/profile/post-processes/profile`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Post-Process Profile Edited!' } } });
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

