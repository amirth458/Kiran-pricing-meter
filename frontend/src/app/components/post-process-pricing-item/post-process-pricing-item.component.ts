import { Component, OnInit, AfterViewChecked } from '@angular/core';

import * as postProcessPricing from '../../../assets/static/postProcessPricing';

import { Router } from '@angular/router';
@Component({
  selector: 'app-post-process-pricing-item',
  templateUrl: './post-process-pricing-item.component.html',
  styleUrls: ['./post-process-pricing-item.component.css']
})
export class PostProcessPricingItemComponent implements OnInit, AfterViewChecked {

  facilities = [];
  equipments = [];
  processProfiles = [];
  form = {
    id: '',
    postProcessPricingProfileName: '',
    postProcessProfileName: '',
    conditions: [
      { name: '', condition: '', value: '', unit: '' }
    ],
    pricingParameters: [
      { value1: '', value2: '', unit: '' }
    ]
  };
  postProcessPricingId = null;
  postProcessPricings = postProcessPricing;
  processProfiles = [];
  conditions = ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to'];
  units = ['CC', 'UM', 'Days'];
  conditionNames = ['Tolerance Increment', 'Surface Finish Increment'];

  constructor(public route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.postProcessPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const postProcessProfile = this.postProcessPricings.filter(x => x.id == this.postProcessPricingId);
      if (postProcessProfile.length > 0) {
        this.form = { ...this.form, ...postProcessProfile[0] };
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

  addCondition() {
    this.form.conditions.push({ name: '', condition: '', value: '', unit: '' });
  }
  addPricingParameter() {
    this.form.pricingParameters.push({ value1: '', value2: '', unit: '' });
  }
  save() {
    console.log(this.form);
  }
}
