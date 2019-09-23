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
    processParameters: [
      []
    ],
    processDimensionalProperties: [
      []
    ],
    processMaterialCharacteristics: [
      []
    ]
  });

  processParameters = {
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

  processDimensionalProperties = {
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

  processMaterialCharacteristics = {
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

  selectedProcessParameters = [
    { name: '', condition: '', value: '', unit: '' }
  ];
  selectedProcessDimensionalProperties = [
    { name: '', condition: '', value: '', unit: '' }
  ];
  selectedProcessMaterialCharacteristics = [
    { name: '', condition: '', value: '', unit: '' }
  ];

  processProfileId = null;
  processProfiles = processProfiles;

  defaultValues = {
    processParameters: [],
    processDimensionalProperties: [
      { name: 'X', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Y', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Z', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Equipment Name', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Tolerance Percent', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Tolerance Base', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Tolerance Increment', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Percent Tolerance', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Surface Roughness', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Wall thickness', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Features Size', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Base Tolerance', value: '-', condition: 'Equal to', unit: 'inches' }
    ],
    processMaterialCharacteristics: [
      { name: 'Tensile Strength', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Equipment Name', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Is Thickness Uniform', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Access Features With Line of Sight', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: 'Not Cylindrical', value: '-', condition: 'Equal to', unit: 'inches' },
      { name: '3 Dimensional Lattice', value: '-', condition: 'Equal to', unit: 'inches' },
    ]
  };
  activeTab = 'processParameters';
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
      const processDimensionalProperties = await this.processMetaData.getProcessDimensionalPropertyType().toPromise();
      const processMaterialCharacteristics = await this.processMetaData.getProcessMaterialCharacteristicType().toPromise();

      this.processParameters.conditionNames = processParameterType.metadataList;
      this.processParameters.conditions = operatorType.metadataList;
      this.processDimensionalProperties.conditions = operatorType.metadataList;
      this.processMaterialCharacteristics.conditions = operatorType.metadataList;
      this.processDimensionalProperties.conditionNames = processDimensionalProperties.metadataList;
      this.processMaterialCharacteristics.conditionNames = processMaterialCharacteristics.metadataList;
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
      case 'processParameters':
        this.selectedProcessParameters.push({ name: '', condition: '', value: '', unit: '' });
        break;
      case 'processDimensionalProperties':
        this.selectedProcessDimensionalProperties.push({ name: '', condition: '', value: '', unit: '' });
        break;
      case 'processMaterialCharacteristics':
        this.selectedProcessMaterialCharacteristics.push({ name: '', condition: '', value: '', unit: '' });
        break;

      default:
        break;
    }
  }

  removeCondition(index, section = this.activeTab) {
    let frontSlice = [];
    let endSlice = [];
    switch (section) {
      case 'processParameters':
        frontSlice = this.selectedProcessParameters.slice(0, index);
        endSlice = this.selectedProcessParameters.slice(index + 1);
        this.selectedProcessParameters = frontSlice.concat(endSlice);
        console.log(this.selectedProcessParameters);
        break;
      case 'processDimensionalProperties':
        frontSlice = this.selectedProcessDimensionalProperties.slice(0, index);
        endSlice = this.selectedProcessDimensionalProperties.slice(index + 1);
        this.selectedProcessDimensionalProperties = frontSlice.concat(endSlice);
        break;
      case 'processMaterialCharacteristics':
        frontSlice = this.selectedProcessMaterialCharacteristics.slice(0, index);
        endSlice = this.selectedProcessMaterialCharacteristics.slice(index + 1);
        this.selectedProcessMaterialCharacteristics = frontSlice.concat(endSlice);
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
    const postData = {
    id: this.form.value.id,
      vendorId: this.userService.getUserInfo().id,
      processProfileName: this.form.value.processProfileName,
      equipment: { id: this.form.value.equipment },
      materialList: [...this.form.value.material.map((materialId) => {
        return { id: materialId };
      })],
      processParameters: [...this.selectedProcessParameters.map(x => new Object({ id: x }))],
      processDimensionalProperties: [...this.selectedProcessDimensionalProperties.map(x => new Object({ id: x }))],
      processMaterialCharacteristics: [...this.selectedProcessMaterialCharacteristics.map(x => new Object({ id: x }))],
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
