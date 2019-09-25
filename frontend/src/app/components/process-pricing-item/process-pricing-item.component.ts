import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-process-pricing-item',
  templateUrl: './process-pricing-item.component.html',
  styleUrls: ['./process-pricing-item.component.css']
})
export class ProcessPricingItemComponent implements OnInit, AfterViewChecked {
  facilities = [];
  equipments = [];

  form: FormGroup = this.fb.group({
    id: '',
    vendorId: [null],
    pricingProfileName: [null],
    processProfileName: [null, Validators.required],
    conditions: [[]],
    pricingParameters: [[]]
  });


  selectedConditions = [
    { name: '', condition: '', value: '', unit: '' }
  ];
  selectedPricingParameters = [
    { value1: '', value2: '', unit: '' }
  ];


  processPricingId = null;
  processPricings = [];
  processProfiles = [];

  conditions = ['Equal to', 'Not equal to', 'Grater than', 'Grater than or Equal', 'Less than', 'Less than or Equal', 'Equal to'];
  units = ['CC', 'UM', 'Days'];
  conditionNames = ['Part Volume', 'Layer Height', 'Lead Time To Production'];

  isNew = true;
  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaData: ProcessMetadataService,
    public spinner: NgxSpinnerService,
    public userService: UserService
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show();
      const pricingParameterType = await this.processMetaData.getProcessPricingParameterType().toPromise();
      const pricingConditionType = await this.processMetaData.getProcessPricingConditionType().toPromise();
      const operatorType = await this.processMetaData.getoperatorType().toPromise();

      this.conditionNames = pricingParameterType.metadataList;
      this.conditions = operatorType.metadataList;
      this.units = pricingConditionType.metadataList;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
    if (this.route.url.includes('edit')) {
      this.isNew = false;
      this.processPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
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

  addCondition() {
    this.selectedConditions.push({ name: '', condition: '', value: '', unit: '' });
  }
  addPricingParameter() {
    this.selectedPricingParameters.push({ value1: '', value2: '', unit: '' });
  }

  removeCondition(index, section) {
    let frontSlice = [];
    let endSlice = [];
    switch (section) {
      case 'conditions':
        if (this.selectedConditions.length !== 1) {
          frontSlice = this.selectedConditions.slice(0, index);
          endSlice = this.selectedConditions.slice(index + 1);
          this.selectedConditions = frontSlice.concat(endSlice);
        }
        break;
      case 'pricingParameters':
        if (this.selectedPricingParameters.length !== 1) {
          frontSlice = this.selectedPricingParameters.slice(0, index);
          endSlice = this.selectedPricingParameters.slice(index + 1);
          this.selectedPricingParameters = frontSlice.concat(endSlice);
        }
        break;
      default:
        break;
    }
  }

  prepareData() {
    const postData = {
      id: this.form.value.id,
      vendorId: this.userService.getVendorInfo().id,
      processPricingName: this.form.value.processPricingName,
      processProfileName: this.form.value.processProfileName,
      conditions: [...this.selectedConditions.map(x => new Object({ id: x }))],
      pricingParameters: [...this.selectedPricingParameters.map(x => new Object({ id: x }))],
      updatedDate: '',
      createdBy: '',
      createdDate: '',
    };

    postData.updatedDate = new Date().toString();
    if (this.isNew) {
      postData.createdBy = String(this.userService.getVendorInfo().id);
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
      const vendorId = this.userService.getVendorInfo().id;
      console.log({ postData, vendorId });
    }
  }
}
