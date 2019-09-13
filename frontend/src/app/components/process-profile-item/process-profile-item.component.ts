import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as processProfiles from '../../../assets/static/processProfile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-profile-item',
  templateUrl: './process-profile-item.component.html',
  styleUrls: ['./process-profile-item.component.css']
})
export class ProcessProfileItemComponent implements OnInit, AfterViewChecked {

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
    processDetails: [
      { name: '', condition: '', value: '', unit: '' }
    ],
    processDimensionalProperties: [
      { name: '', condition: '', value: '', unit: '' }
    ],
    processMaterialCharacteristics: [
      { name: '', condition: '', value: '', unit: '' }
    ]
  };
  processDetails = {
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
    conditionNames: ['Base Tolerance', 'Tolerance Increment']
  };

  processMaterialCharacteristics = {
    conditions: ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to'],
    units: ['MPa'],
    conditionNames: ['Tensile Strength']
  };

  processProfileId = null;
  processProfiles = processProfiles;

  activeTab = 'Process Material Characteristics';
  constructor(private route: Router) { }

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
      case 'processDetails':
        this.form.processDetails.push({ name: '', condition: '', value: '', unit: '' });
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

  toggleTab(tabName) {
    this.activeTab = tabName;
  }
  save() {
    console.log(this.form);
  }
}
