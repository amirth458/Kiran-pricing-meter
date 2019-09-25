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

  form: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null],
    name: [null],
    equipment: [null, Validators.required],
    material: [null, Validators.required],
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

  processParameterList = {
    conditions: [],
    conditionNames: [],
  };

  processDimensionalPropertyList = {
    conditions: [],
    units: [],
    conditionNames: []
  };

  processMaterialCharacteristicList = {
    conditions: [],
    units: [],
    conditionNames: []
  };

  signTypes = [];
  units = [];
  conditions = {};

  selectedProcessParameterList = [
    // { name: '', condition: '', value: '', unit: '' }
    {
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
      operandTypeList: []
    }
  ];
  selectedProcessDimensionalPropertyList = [
    {
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
      operandTypeList: []
    }
  ];
  selectedProcessMaterialCharacteristicList = [
    {

      operatorType: {
        id: ''
      },
      processMaterialCharacteristicType: {
        id: '',
      },
      unitType: {
        id: ''
      },
      value: '',
      valueInDefaultUnit: '',
      valueSignType: {
        id: ''
      },
      operandTypeList: []
    }
  ];


  processProfileId = null;
  processProfiles = processProfiles;

  defaultValues = {
    processParameterList: [],
    processDimensionalPropertyList: [],
    processMaterialCharacteristicList: []
  };
  activeTab = 'processParameterList';
  activeTabName = 'Process Parameters';

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
      const operatorType = await this.processMetaData.getoperatorType().toPromise();
      const processDimensionalPropertyList = await this.processMetaData.getProcessDimensionalPropertyType().toPromise();
      const processMaterialCharacteristicList = await this.processMetaData.getProcessMaterialCharacteristicType().toPromise();
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

      this.processParameterList.conditionNames = processParameterType.metadataList;
      // this.processParameterList.conditions = operatorType.metadataList;

      // this.processDimensionalPropertyList.conditions = operatorType.metadataList;
      // this.processMaterialCharacteristicList.conditions = operatorType.metadataList;

      this.processDimensionalPropertyList.conditionNames = processDimensionalPropertyList.metadataList;
      this.processMaterialCharacteristicList.conditionNames = processMaterialCharacteristicList.metadataList;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }

    if (this.route.url.includes('edit')) {
      this.isNew = false;
      this.processProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      // tslint:disable-next-line:max-line-length
      const processProfile = await this.processProfileService.getProfile(this.userService.getUserInfo().id, this.processProfileId).toPromise();
      this.initForm(processProfile);
    }
  }

  ngAfterViewChecked(): void {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    const validation = Array.prototype.filter.call(forms, (form) => {
      form.addEventListener('submit', (event) => {
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

  getProperOperands(conditionId, index, section) {
    if (section === 'Process Parameters') {
      const operandTypeName = this.processParameterList.conditionNames
        .filter(condition => condition.id === conditionId)[0].operandType.name;
      this.selectedProcessParameterList[index].operandTypeList = this.conditions[operandTypeName.toString()];
    } else if (section === 'Process Dimensional Properties') {
      // tslint:disable-next-line:max-line-length
      const operandTypeName = this.processDimensionalPropertyList.conditionNames
        .filter(condition => condition.id === conditionId)[0].operandType.name;
      this.selectedProcessDimensionalPropertyList[index].operandTypeList = this.conditions[operandTypeName.toString()];
    } else if (section === 'Process Material Characteristics') {
      // tslint:disable-next-line:max-line-length
      const operandTypeName = this.processMaterialCharacteristicList.conditionNames
        .filter(condition => condition.id === conditionId)[0].operandType.name;
      this.selectedProcessMaterialCharacteristicList[index].operandTypeList = this.conditions[operandTypeName.toString()];
    }

  }


  addCondition(section = this.activeTab) {
    switch (section) {
      case 'processParameterList':
        this.selectedProcessParameterList.push(
          {
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
            operandTypeList: []
          }
        );
        break;
      case 'processDimensionalPropertyList':
        this.selectedProcessDimensionalPropertyList.push(
          {
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
            operandTypeList: []
          }
        );
        break;
      case 'processMaterialCharacteristicList':
        this.selectedProcessMaterialCharacteristicList.push(
          {
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
            operandTypeList: []
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
        if (this.selectedProcessParameterList.length !== 1) {
          frontSlice = this.selectedProcessDimensionalPropertyList.slice(0, index);
          endSlice = this.selectedProcessDimensionalPropertyList.slice(index + 1);
          this.selectedProcessDimensionalPropertyList = frontSlice.concat(endSlice);
        }
        break;
      case 'processMaterialCharacteristicList':
        if (this.selectedProcessParameterList.length !== 1) {
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
    this.activeTab = tab;
    this.activeTabName = tabName;
  }

  applyDefaults() {
    this[this.activeTab] = [];
    this[this.activeTab] = this.defaultValues[this.activeTab];
    console.log(this.form);
    this.closeModal.nativeElement.click();
  }


  async getInputValues() {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 5000, sort: 'name,ASC', page, q: '' };
        const res = await this.machineService.getMachinery(this.userService.getUserInfo().id, param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        page++;
      }
      rows.map(machine => {
        this.equipments.push(machine.equipment);
      });
      rows.map(machine => {
        machine.machineServingMaterialList.map(material => {
          this.materials.push(material.material);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }


  initForm(processProfile) {
    this.form.setValue({
      id: processProfile.id,
      name: processProfile.name,
      vendorId: processProfile.vendorId,
      equipment: processProfile.machineServingMaterial.vendorMachinery.equipment.id,
      material: processProfile.machineServingMaterial.material.id,
      processParameterList: processProfile.processParameterList,
      processMaterialCharacteristicList: processProfile.processMaterialCharacteristicList,
      processDimensionalPropertyList: processProfile.processDimensionalPropertyList
    });

    this.selectedProcessParameterList = [...processProfile.processParameterList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessMaterialCharacteristicList = [...processProfile.processMaterialCharacteristicList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedProcessDimensionalPropertyList = [...processProfile.processDimensionalPropertyList.map(x => { x.operandTypeList = []; return x; })];

    console.log(this.selectedProcessDimensionalPropertyList, 'dime');
    console.log(this.selectedProcessMaterialCharacteristicList, 'material');
    console.log(this.selectedProcessParameterList, 'param');

    this.selectedProcessParameterList.map((parameter, index) => {
      this.getProperOperands(parameter.operatorType.id, index, 'Process Parameters');
    });
    this.selectedProcessMaterialCharacteristicList.map((parameter, index) => {
      this.getProperOperands(parameter.operatorType.id, index, 'Process Material Characteristics');
    });
    this.selectedProcessDimensionalPropertyList.map((parameter, index) => {
      console.log(parameter);
      if (parameter.operatorType) {
        this.getProperOperands(parameter.operatorType.id, index, 'Process Dimensional Properties');
      } else {
        this.selectedProcessDimensionalPropertyList[index].operandTypeList = [];
      }
    });
  }

  prepareData() {
    const postData = {
      vendorId: this.userService.getUserInfo().id,
      name: this.form.value.name || 'Process Profile - ' + this.getRandomString(7),
      equipment: { id: this.form.value.equipment },
      // machineServingMaterial: { id: this.form.value.material[0] },
      // TODO: Make this value dynamic
      machineServingMaterial: { id: 128 },
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
        const vendorId = this.userService.getUserInfo().id;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          console.log({ postData, vendorId });
          try {
            await this.processProfileService.saveProfile(vendorId, postData).toPromise();
            const gotoURL = `/profile/processes/profile`;
            this.route.navigateByUrl(gotoURL);
          } catch (e) {
            this.spinner.hide();
          }
        } else {
          this.spinner.show();
          try {
            await this.processProfileService.updateProfile(vendorId, this.processProfileId, postData).toPromise();
          } catch (e) {
            console.log(e);
          } finally {
            this.spinner.hide();
            const gotoURL = `/profile/vendor/processes/profile`;
            this.route.navigateByUrl(gotoURL);
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
