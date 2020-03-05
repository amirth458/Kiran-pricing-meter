import { ActionService } from './../../../../../service/action.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { RfqPricingService } from './../../../../../service/rfq-pricing.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-pricing-settings',
  templateUrl: './pricing-settings.component.html',
  styleUrls: ['./pricing-settings.component.css']
})
export class PricingSettingsComponent implements OnInit {
  detailForm: FormGroup = this.fb.group(
    {
      minElligibleProcessProfile: [null],
      minElligiblePricingProfile: [null],
      presentBidNumberFromBottom: [null],
      incrementalMarginPercent: [null],
      incrementalMarginRate: [null],
      specificityPremium: [null],
      autoPricingEligibilityType: [null],
      quoteExpirationTime: [null]
    },
    { validators: [this.checkBidNumber, this.profileCounts, this.checkIncrementalMargin] }
  );
  manualPricingSection = 3;

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

  checkBidNumber(control: FormGroup) {
    const bidNumber = control.get('presentBidNumberFromBottom');
    const processProfile = control.get('minElligibleProcessProfile');
    return bidNumber.value && processProfile.value && (+bidNumber.value || 0) > (+processProfile.value || 0)
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
    return incrementalMarginPercent.value && incrementalMarginRate.value ? { invalidIncrementalMargin: true } : null;
  }

  ngOnInit() {
    this.pricingService.getPricingSettings().subscribe(defaultValue => {
      if (defaultValue) {
        this.detailForm.setValue(defaultValue);
        this.selectedEligibility = defaultValue.autoPricingEligibilityType.id - 1;
      }
    });
    this.actionService.saveProfileSettingAction().subscribe(() => {
      this.save();
    });
  }

  async save() {
    console.log(this.detailForm);
    if (this.detailForm.valid) {
      this.pricingService
        .setPricingSetting(this.detailForm.value)
        .pipe(catchError(e => this.handleSaveError(e)))
        .subscribe(v => {
          this.detailForm.setValue(v);
          this.toastrService.success(`Pricing Settings Updated Successfully`);
        });
    } else if (this.detailForm.errors.invalidIncrementalMargin) {
      this.toastrService.warning(
        'User can not set both for Incremental Margin Rate and Percent, Please input only one value'
      );
    } else if (this.detailForm.errors.invalidCount) {
      this.toastrService.warning('Must set one of the cut off for manual pricing.');
    }
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || 'Import Failed.';
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }

  setManualPricingSection(newValue: number) {
    this.manualPricingSection = newValue;
    const setValue = {
      minElligiblePricingProfile: this.detailForm.value.minElligiblePricingProfile,
      minElligibleProcessProfile: this.detailForm.value.minElligibleProcessProfile
    };
    switch (newValue) {
      case 1:
        setValue.minElligiblePricingProfile = null;
        break;
      case 2:
        setValue.minElligibleProcessProfile = null;
        break;
    }
    console.log({ ...this.detailForm.value, ...setValue });
    this.detailForm.setValue({ ...this.detailForm.value, ...setValue });
  }
  setEligibility(newValue: number) {
    this.selectedEligibility = newValue;
    this.detailForm.setValue({
      ...this.detailForm.value,
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
