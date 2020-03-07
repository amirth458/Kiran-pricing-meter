import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { ActionService } from '../../../../../service/action.service';
import { PricingType } from '../../../../../model/pricing.breakdown';

@Component({
  selector: 'app-pricing-settings',
  templateUrl: './pricing-settings.component.html',
  styleUrls: ['./pricing-settings.component.css']
})
export class PricingSettingsComponent implements OnInit {
  formGroup: FormGroup = this.fb.group(
    {
      minElligibleProcessProfile: [null],
      minElligiblePricingProfile: [null],
      presentBidNumberFromBottom: [null],
      incrementalMarginPercent: [null],
      incrementalMarginRate: [null],
      // NOTE: we dont use below values
      specificityPremium: [null],
      autoPricingEligibilityType: [null],
      quoteExpirationTime: [null],
      pricingType: [3]
    },
    {
      validators: [this.profile, this.checkBidNumber, this.profileCounts, this.checkIncrementalMargin]
    }
  );
  profilePricingType = PricingType;

  pricingDropDownItems: any = [
    {
      id: PricingType.PROFILE,
      value: 'Eligible Process Profile'
    },
    {
      id: PricingType.PRICING,
      value: 'Eligible Pricing Profile'
    },
    {
      id: PricingType.BOTH,
      value: 'Eligible Process Profiles & Eligible Pricing Profiles'
    }
  ];

  defaultEligibilities = [
    {
      id: 1,
      name: 'Based on Process Profiles',
      description: '(Show all process profiles with or without matching pricing profile)'
    },
    {
      id: 2,
      name: 'Based on Pricing Profiles',
      description: '(Sort and filter based on pricing profiles)'
    }
  ];
  selectedEligibility = 1;

  constructor(
    private fb: FormBuilder,
    private pricingService: RfqPricingService,
    private toastrService: ToastrService,
    private actionService: ActionService
  ) {}

  profile(form: FormGroup) {
    const pricingCtl = form.get('minElligiblePricingProfile');
    const processCtl = form.get('minElligibleProcessProfile');
    const pricingType = form.get('pricingType');
    let valid = false;
    switch (pricingType.value || 0) {
      case PricingType.PROFILE:
        valid = Number(processCtl.value) > 0;
        break;
      case PricingType.PRICING:
        valid = Number(pricingCtl.value) > 0;
        break;
      case PricingType.BOTH:
        valid = Number(pricingCtl.value) > 0 && Number(processCtl.value) > 0;
        break;
    }
    return !valid ? { hasValidProfile: true } : null;
  }

  checkBidNumber(control: FormGroup) {
    const bidNumber = control.get('presentBidNumberFromBottom');
    const pricingProfile = control.get('minElligiblePricingProfile');
    return bidNumber.value && pricingProfile.value && (+bidNumber.value || 0) > (+pricingProfile.value || 0)
      ? { invalidBidNumber: true }
      : null;
  }

  profileCounts(control: FormGroup) {
    const profile = control.get('minElligibleProcessProfile');
    const pricing = control.get('minElligiblePricingProfile');
    return !profile.value && !pricing.value ? { invalidCount: true } : null;
  }

  checkIncrementalMargin(control: FormGroup) {
    const incrementalMarginPercent = control.get('incrementalMarginPercent');
    const incrementalMarginRate = control.get('incrementalMarginRate');
    return incrementalMarginPercent.value && incrementalMarginRate.value
      ? { invalidIncrementalMargin: true }
      : !(incrementalMarginPercent.value || incrementalMarginRate.value)
      ? { requiredIncrementalMargin: true }
      : null;
  }

  ngOnInit() {
    this.pricingService.getPricingSettings().subscribe(defaultValue => {
      console.log(defaultValue);
      if (defaultValue) {
        let type: any = {};
        if (defaultValue.minElligibleProcessProfile && defaultValue.minElligiblePricingProfile) {
          type.pricingType = PricingType.BOTH;
        } else if (defaultValue.minElligibleProcessProfile) {
          type.pricingType = PricingType.PROFILE;
        } else {
          type.pricingType = PricingType.PRICING;
        }
        this.formGroup.setValue({ ...defaultValue, ...type });
        this.selectedEligibility = defaultValue.autoPricingEligibilityType.id - 1;
      }
    });
    this.actionService.saveProfileSettingAction().subscribe(() => {
      this.save();
    });
  }

  async save() {
    if (this.formGroup.valid) {
      this.pricingService
        .setPricingSetting(this.formGroup.value)
        .pipe(catchError(e => this.handleSaveError(e)))
        .subscribe(v => {
          this.formGroup.setValue(v);
          this.toastrService.success(`Pricing Settings Updated Successfully`);
        });
    } else if (this.formGroup.errors.invalidIncrementalMargin) {
      this.toastrService.warning(
        'User can not set both for Incremental Margin Rate and Percent, Please input only one value'
      );
    } else if (this.formGroup.errors.invalidCount) {
      this.toastrService.warning('Must set one of the cut off for manual pricing.');
    } else if (this.formGroup.errors.requiredIncrementalMargin) {
      this.toastrService.warning('Must set one of the Incremental Margin.');
    }
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || 'Import Failed.';
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }

  setManualPricingSection(value: number) {
    this.formGroup.get('pricingType').setValue(value);
    const setValue = {
      minElligiblePricingProfile: this.formGroup.value.minElligiblePricingProfile,
      minElligibleProcessProfile: this.formGroup.value.minElligibleProcessProfile
    };
    switch (value) {
      case PricingType.PRICING:
        setValue.minElligiblePricingProfile = null;
        break;
      case PricingType.PROFILE:
        setValue.minElligibleProcessProfile = null;
        break;
    }
    console.log({ ...this.formGroup.value, ...setValue });
    this.formGroup.setValue({ ...this.formGroup.value, ...setValue });
  }

  setEligibility(newValue: number) {
    this.selectedEligibility = newValue;
    this.formGroup.setValue({
      ...this.formGroup.value,
      autoPricingEligibilityType: this.defaultEligibilities[newValue]
    });
  }

  getOrderUnit(num: number) {
    num = num % 100;
    if (num >= 10 && num <= 20) {
      return 'th';
    }
    if (num % 10 === 1) {
      return 'st';
    } else if (num % 10 === 2) {
      return 'nd';
    } else if (num % 10 === 3) {
      return 'rd';
    } else {
      return 'th';
    }
  }
}
