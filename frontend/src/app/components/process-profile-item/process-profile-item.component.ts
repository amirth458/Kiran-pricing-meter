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

@Component({
  selector: 'app-process-profile-item',
  templateUrl: './process-profile-item.component.html',
  styleUrls: ['./process-profile-item.component.css']
})
export class ProcessProfileItemComponent implements OnInit, AfterViewChecked {

  @ViewChild('closeModal') closeModal: ElementRef;
  facilities = [];
  equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  materials = [{ id: '', name: 'more than 2 characters to start search' }];

  isMaterialLoading = false;
  isEquipmentLoading = false;

  form: FormGroup = this.fb.group({
    id: [null],
    vendorId: [null],
    processProfileName: [null],
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
    ]
  });

  processParameterList = {
    conditions: ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to'],
    units: ['%', 'micron'],
    conditionNames: [
      'Layer Height',
      'Infill',
      'Tolerance Base',
      'Tensile Strength',
      'Tensile Modulus',
      'Surface Finish',
    ],
  };

  processDimensionalPropertyList = {
    conditions: ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to'],
    units: ['inches'],
    conditionNames: [
      'X',
      'Y',
      'Z',
      'Equipment Name',
      'Tolerance Percent',
      'Tolerance Base',
      'Tolerance Increment',
      'Percent Tolerance',
      'Surface Roughness',
      'Wall thickness',
      'Features Size',
      'Base Tolerance',
    ]
  };

  processMaterialCharacteristicList = {
    conditions: ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to'],
    units: ['MPa'],
    conditionNames: [
      'Tensile Strength',
      'Equipment Name',
      'Is Thickness Uniform',
      'Access Features With Line of Sight',
      '3 Dimensional Lattice',
      'Not Cylindrical',
    ]
  };

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
      }
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
      }
    }
  ];
  selectedProcessMaterialCharacteristicList = [
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
      }
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

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaData: ProcessMetadataService,
    public spinner: NgxSpinnerService,
    public userService: UserService,
    public machineService: MachineService,
    public materialService: MaterialService,
    public equipmentService: EquipmentService,
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show();

      const processParameterType = await this.processMetaData.getProcessParameterType().toPromise();
      const operatorType = await this.processMetaData.getoperatorType().toPromise();
      const processDimensionalPropertyList = await this.processMetaData.getProcessDimensionalPropertyType().toPromise();
      const processMaterialCharacteristicList = await this.processMetaData.getProcessMaterialCharacteristicType().toPromise();

      this.processParameterList.conditionNames = processParameterType.metadataList;
      this.processParameterList.conditions = operatorType.metadataList;
      this.processDimensionalPropertyList.conditions = operatorType.metadataList;
      this.processMaterialCharacteristicList.conditions = operatorType.metadataList;
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
      // Make API request
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
        } else {

        }
        form.classList.add('was-validated');
      }, false);
    });
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
            }
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
            }
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
            }
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
        frontSlice = this.selectedProcessParameterList.slice(0, index);
        endSlice = this.selectedProcessParameterList.slice(index + 1);
        this.selectedProcessParameterList = frontSlice.concat(endSlice);
        console.log(this.selectedProcessParameterList);
        break;
      case 'processDimensionalPropertyList':
        frontSlice = this.selectedProcessDimensionalPropertyList.slice(0, index);
        endSlice = this.selectedProcessDimensionalPropertyList.slice(index + 1);
        this.selectedProcessDimensionalPropertyList = frontSlice.concat(endSlice);
        break;
      case 'processMaterialCharacteristicList':
        frontSlice = this.selectedProcessMaterialCharacteristicList.slice(0, index);
        endSlice = this.selectedProcessMaterialCharacteristicList.slice(index + 1);
        this.selectedProcessMaterialCharacteristicList = frontSlice.concat(endSlice);
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


  async getMaterials(q) {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q };
        const res = await this.materialService.getMaterials(param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        page++;
      }
      this.materials = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  async getEquipments(q) {
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const param: FilterOption = { size: 1000, sort: 'name,ASC', page, q };
        const res = await this.equipmentService.getEquipments(param).toPromise();
        if (!res.content || res.content.length === 0) {
          break;
        }
        rows.push(...res.content);
        page++;
      }
      this.equipments = rows;
    } catch (e) {
      this.spinner.hide();
      console.log(e);
    }
  }

  clearStore() {
    this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
    this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
  }

  async onMaterialSearch(event) {
    if (event.keyCode === 13) {
      this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
      // this.materials = [];
    }
    if (event.target.value.length >= 2) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        return;
      }
      this.isMaterialLoading = true;
      await this.getMaterials(event.target.value);
      this.isMaterialLoading = false;
    } else {
      this.materials = [{ id: '', name: 'more than 2 characters to start search' }];
    }
  }

  async onEquipmentSearch(event) {
    if (event.keyCode === 13) {
      this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
      // this.equipments = [];
    }

    if (event.target.value.length >= 2) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        return;
      }
      this.isEquipmentLoading = true;
      await this.getEquipments(event.target.value);
      this.isEquipmentLoading = false;
    } else {
      this.equipments = [{ id: '', name: 'more than 2 characters to start search' }];
    }
  }

  prepareData() {
    // TODO: add valueSignType to all
    const postData = {
      id: this.form.value.id,
      vendorId: this.userService.getUserInfo().id,
      processProfileName: this.form.value.processProfileName,
      equipment: { id: this.form.value.equipment },
      materialList: [...this.form.value.material.map((materialId) => {
        return { id: materialId };
      })],
      processParameterList: [...this.selectedProcessParameterList],
      processDimensionalPropertyList: [...this.selectedProcessDimensionalPropertyList],
      processMaterialCharacteristicList: [...this.selectedProcessMaterialCharacteristicList],
      updatedDate: '',
      createdBy: '',
      createdDate: '',
    };

    postData.updatedDate = new Date().toString();
    if (this.isNew) {
      postData.createdBy = String(this.userService.getUserInfo().id);
      postData.createdDate = new Date().toString();
    } else {
      postData.updatedDate = new Date().toString();
    }
    return postData;
  }

  save(event) {
    event.preventDefault();
    if (this.form.valid) {
      const postData = this.prepareData();
      const vendorId = this.userService.getUserInfo().id;
      console.log({ postData, vendorId });
    }
  }
}
