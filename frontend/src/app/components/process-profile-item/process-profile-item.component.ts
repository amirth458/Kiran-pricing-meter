import { Component, OnInit, AfterViewChecked, Input, ElementRef, ViewChild } from '@angular/core';

import * as processProfiles from '../../../assets/static/processProfile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-profile-item',
  templateUrl: './process-profile-item.component.html',
  styleUrls: ['./process-profile-item.component.css']
})
export class ProcessProfileItemComponent implements OnInit, AfterViewChecked {

  @ViewChild('closeModal') closeModal: ElementRef;
  facilities = [];
  equipments = [];
  form = {
    id: '',
    processProfileName: '',
    equipment: '',
    materialName:'',
    processType: '',
    layerHeight: '',
    infill: '',
    toleranceBase: '',
    tensileStrength: '',
    tensileModulus: '',
    surfaceFinish: '',

    pricingProfileName: '',
    processParameters: [
      { name: '', condition: '', value: '', unit: '' }
    ],
    processDimensionalProperties: [
      { name: '', condition: '', value: '', unit: '' }
    ],
    processMaterialCharacteristics: [
      { name: '', condition: '', value: '', unit: '' }
    ]
  };
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

  materials:[];

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
  constructor(public route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.processProfileId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const processProfile = this.processProfiles.filter(x => x.id == this.processProfileId);
      if (processProfile.length > 0) {
        this.form = { ...this.form, ...processProfile[0] };
      }
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
          this.save();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }

  addCondition(section) {
    switch (section) {
      case 'processParameters':
        this.form.processParameters.push({ name: '', condition: '', value: '', unit: '' });
        break;
      case 'processDimensionalProperties':
        this.form.processDimensionalProperties.push({ name: '', condition: '', value: '', unit: '' });
        break;
      case 'processMaterialCharacteristics':
        this.form.processMaterialCharacteristics.push({ name: '', condition: '', value: '', unit: '' });
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
    this.form[this.activeTab] = [];
    this.form[this.activeTab] = this.defaultValues[this.activeTab]
    console.log(this.form);
    this.closeModal.nativeElement.click();
  }

  save() {
    console.log(this.form);
  }
}
