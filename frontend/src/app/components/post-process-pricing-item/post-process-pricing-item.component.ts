import { Component, OnInit, AfterViewChecked } from '@angular/core';

import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ProcessMetadataService } from 'src/app/service/process-metadata.service';
import { PricingMetadataService } from 'src/app/service/pricing-metadata.service';
import { PostProcessPricingService } from 'src/app/service/post-process-pricing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/service/user.service';
import { PostProcessProfileService } from 'src/app/service/post-process-profile.service';
@Component({
  selector: 'app-post-process-pricing-item',
  templateUrl: './post-process-pricing-item.component.html',
  styleUrls: ['./post-process-pricing-item.component.css']
})
export class PostProcessPricingItemComponent implements OnInit, AfterViewChecked {


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

  error = '';
  isNew = true;
  isFormValid = false;


  constructor(
    public route: Router,
    public fb: FormBuilder,
    public processMetaDataService: ProcessMetadataService,
    public pricingMetaDataService: PricingMetadataService,
    public processProfileService: PostProcessProfileService,
    public postProcessPricingService: PostProcessPricingService,
    public spinner: NgxSpinnerService,
    public userService: UserService
  ) { }

  async ngOnInit() {
    try {
      this.spinner.show();

      this.processProfiles = await this.processProfileService.getAllProfiles(this.userService.getVendorInfo().id).toPromise();

      const signType = await this.processMetaDataService.getValueSignType(true).toPromise();
      const units = await this.processMetaDataService.getMeasurementUnitType(true).toPromise();
      const pricingParameterType = await this.pricingMetaDataService.getConditionParameters(true).toPromise();
      const pricingConditionType = await this.pricingMetaDataService.getConditionTypes(true).toPromise();
      const operatorType = await this.processMetaDataService.getoperatorType(true).toPromise();
      const currency = await this.processMetaDataService.getCurrency(true).toPromise();

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
      const processProfile = await this.postProcessPricingService.getProfile(this.userService.getVendorInfo().id, this.processPricingId).toPromise();
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
      this.onPropertyChange(parameter.processPricingConditionType.id, index);
    });

    this.processProfileChanged();
  }

  onPropertyChange(conditionId, index) {
    // Set proper operands
    const operand = this.pricingConditionTypes.filter(condition => condition.id == conditionId)[0];
    const operandTypeName = operand.operandType.name;
    this.selectedPricingConditionList[index].operandTypeList = this.conditions[operandTypeName.toString()];

    // Set proper sign types
    let signTypeId = null;
    if (operandTypeName == 'absolute') {
      signTypeId = this.signTypes.filter(x => x.name == 'absolute')[0].id;
    } else {
      signTypeId = this.signTypes.filter(x => x.name == 'positive')[0].id;
    }
    this.selectedPricingConditionList[index].valueSignType = {
      id: signTypeId
    };
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
        this.error = '';
        const vendorId = this.userService.getVendorInfo().id;
        const postData = this.prepareData();
        if (this.isNew) {
          this.spinner.show();
          try {
            await this.postProcessPricingService.saveProfile(vendorId, postData).toPromise();
            const gotoURL = `/profile/post-processes/pricing`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Post-Process Pricing Created!!' } } });
          } catch (e) {
            console.log(e);
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
            await this.postProcessPricingService.updateProfile(vendorId, this.processPricingId, postData).toPromise();
            const gotoURL = `/profile/post-processes/pricing`;
            this.route.navigateByUrl(gotoURL, { state: { toast: { type: 'success', body: 'Post-Process Pricing Edited!' } } });
          } catch (e) {
            console.log(e);
            if (e.error && e.error.message) {
              this.error = e.error.message;
            } else {
              this.error = 'An error occured while talking to our server.';
            }
          } finally {
            this.spinner.hide();
            // this.submitActive = true;

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
