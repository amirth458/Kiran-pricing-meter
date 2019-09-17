import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-process-pricing-item',
  templateUrl: './process-pricing-item.component.html',
  styleUrls: ['./process-pricing-item.component.css']
})
export class ProcessPricingItemComponent implements OnInit, AfterViewChecked {
  facilities = [];
  equipments = [];
  form = {
    id: '',
    pricingProfileName: '',
    processProfileName: '',
    conditions: [
      { name: '', condition: '', value: '', unit: '' }
    ],
    pricingParameters: [
      { value1: '', value2: '', unit: '' }
    ]
  };
  processPricingId = null;
  processPricings = [];

  conditions = ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to',];
  units = ['CC', 'UM', 'Days'];
  conditionNames = ['Part Volume', 'Layer Height', 'Lead Time To Production'];

  constructor(public route: Router) { }

  ngOnInit() {
    if (this.route.url.includes('edit')) {
      this.processPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      const processProfile = this.processPricings.filter(x => x.id == this.processPricingId);
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
