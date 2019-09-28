import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';
import { ProcessProfileService } from 'src/app/service/process-profile.service';
import { ProcessPricingService } from 'src/app/service/process-pricing.service';
import { PricingMetadataService } from 'src/app/service/pricing-metadata.service';

@Component({
  selector: 'app-process-pricing-item',
  templateUrl: './process-pricing-item.component.html',
  styleUrls: ['./process-pricing-item.component.css']
})
export class ProcessPricingItemComponent implements OnInit, AfterViewChecked {

  form: FormGroup = this.fb.group({
    id: '',
    pricingProfileName: [null],
    processProfileId: ['', Validators.required],
    processPricingConditionList: [[]],
    processPricingParameterList: [[]]
  });

  conditions = [];

  selectedParameterList = [
    {
      currency: {
        id: '1'
      },

      price: '',
      processPricingParameterType: {
        id: ''
      },
      quantity: '',
      quantityUnitType: {
        id: ''
      }
    }
  ];
  selectedPricingConditionList = [
    {
      operatorType: {
        id: ''
      },

      processPricingConditionType: {
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

  processPricingId = null;

  processProfiles = [];
  units = [];
  signTypes = [];
  pricingConditionTypes = [];
  currencyList = [];
  processPricingParameterTypeList = [];
  filteredProcessPricingParameterTypeList = [];
  filteredPricingConditionTypes = [];

  isNew = true;
  isFormValid = false;


  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaDataService: ProcessMetadataService,
    public pricingMetaDataService: PricingMetadataService,
    public processProfileService: ProcessProfileService,
    public processPricingService: ProcessPricingService,
    public spinner: NgxSpinnerService,
    public userService: UserService
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show();

      this.processProfiles = await this.processProfileService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();

      const signType = await this.processMetaDataService.getValueSignType().toPromise();
      const units = await this.processMetaDataService.getMeasurementUnitType().toPromise();
      const pricingParameterType = await this.pricingMetaDataService.getConditionParameters().toPromise();
      const pricingConditionType = await this.pricingMetaDataService.getConditionTypes().toPromise();
      const operatorType = await this.processMetaDataService.getoperatorType().toPromise();
      const currency = await this.processMetaDataService.getCurrency().toPromise();

      operatorType.metadataList.map(operator => {
        const addedList = Object.keys(this.conditions);
        if (addedList.includes(operator.operandType.name)) {
          this.conditions[operator.operandType.name].push(operator);
        } else {
          this.conditions[operator.operandType.name] = [operator];
        }
      });
      this.processPricingParameterTypeList = pricingParameterType.metadataList;
      this.pricingConditionTypes = pricingConditionType.metadataList;
      this.units = units.metadataList;
      this.signTypes = signType.metadataList;
      this.currencyList = currency.metadataList;

    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
    if (this.route.url.includes('edit')) {
      this.isNew = false;
      this.processPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      // Make API request
      this.isNew = false;
      this.processPricingId = this.route.url.slice(this.route.url.lastIndexOf('/')).split('/')[1];
      // tslint:disable-next-line:max-line-length
      const processProfile = await this.processPricingService.getProfile(this.userService.getVendorInfo().id, this.processPricingId).toPromise();
      this.initForm(processProfile);
      this.spinner.hide();
    }
  }

  initForm(pricingProfile) {
    this.form.setValue({
      id: pricingProfile.id,
      pricingProfileName: pricingProfile.name,
      processProfileId: pricingProfile.processProfile.id,
      processPricingConditionList: pricingProfile.processPricingConditionList,
      processPricingParameterList: pricingProfile.processPricingParameterList,
    });

    this.selectedParameterList = [...pricingProfile.processPricingParameterList.map(x => { x.operandTypeList = []; return x; })];
    // tslint:disable-next-line:max-line-length
    this.selectedPricingConditionList = [...pricingProfile.processPricingConditionList];

    this.selectedPricingConditionList.map((parameter, index) => {
      this.getProperOperands(parameter.processPricingConditionType.id, index);
    });

    this.processProfileChanged();
  }

  getProperOperands(conditionId, index) {
    const operandTypeName = this.pricingConditionTypes.filter(condition => condition.id == conditionId)[0].operandType.name;
    this.selectedPricingConditionList[index].operandTypeList = this.conditions[operandTypeName.toString()];
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

  processProfileChanged() {
    const processProfile = this.processProfiles.filter(profile => profile.id == this.form.value.processProfileId);
    if (processProfile.length) {
      // tslint:disable-next-line:max-line-length
      const processType = processProfile[0].processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment.processTypeName;
      // tslint:disable-next-line:max-line-length
      this.filteredProcessPricingParameterTypeList = this.processPricingParameterTypeList.filter(param => param.processType.name == processType);
      // tslint:disable-next-line:max-line-length
      this.filteredPricingConditionTypes = this.pricingConditionTypes.filter(param => param.processProfileType.name == processProfile[0].processProfileType.name);
    }
  }


  addCondition() {
    this.selectedPricingConditionList.push({
      operatorType: {
        id: ''
      },

      processPricingConditionType: {
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
    });
  }

  addPricingParameter() {
    this.selectedParameterList.push(
      {
        currency: {
          id: '1'
        },

        price: '',
        processPricingParameterType: {
          id: ''
        },
        quantity: '',
        quantityUnitType: {
          id: ''
        }
      }
    );
  }

  removeCondition(index, section) {
    let frontSlice = [];
    let endSlice = [];
    switch (section) {
      case 'Condition':
        if (this.selectedPricingConditionList.length !== 1) {
          frontSlice = this.selectedPricingConditionList.slice(0, index);
          endSlice = this.selectedPricingConditionList.slice(index + 1);
          this.selectedPricingConditionList = frontSlice.concat(endSlice);
        }
        break;
      case 'Parameter':
        if (this.selectedParameterList.length !== 1) {
          frontSlice = this.selectedParameterList.slice(0, index);
          endSlice = this.selectedParameterList.slice(index + 1);
          this.selectedParameterList = frontSlice.concat(endSlice);
        }
        break;
      default:
        break;
    }
  }

  prepareData() {
    const postData = {
      id: this.form.value.id || '',
      name: this.form.value.pricingProfileName || 'Process Pricing - ' + this.getRandomString(7),
      processPricingParameterList: this.selectedParameterList,
      processPricingConditionList: this.selectedPricingConditionList,
      processProfile: { id: this.form.value.processProfileId },
    };
    return postData;
  }

  save(event) {
    event.preventDefault();
    // this.submitActive = false;
    setTimeout(async () => {
      if (this.form.valid && this.isFormValid) {
        const vendorId = this.userService.getVendorInfo().id;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            await this.processPricingService.saveProfile(vendorId, postData).toPromise();
            const gotoURL = `/profile/processes/pricing`;
            this.route.navigateByUrl(gotoURL);
          } catch (e) {
            this.spinner.hide();
          }
        } else {
          this.spinner.show();
          try {
            await this.processPricingService.updateProfile(vendorId, this.processPricingId, postData).toPromise();
          } catch (e) {
            console.log(e);
          } finally {
            this.spinner.hide();
            // this.submitActive = true;
            const gotoURL = `/profile/processes/pricing`;
            this.route.navigateByUrl(gotoURL);
          }
        }
      } else {
        // this.submitActive = true;
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
