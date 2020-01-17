import { ActionService } from './../../../../../service/action.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from "rxjs/operators";
import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { throwError } from 'rxjs';

@Component({
  selector: "app-pricing-settings",
  templateUrl: "./pricing-settings.component.html",
  styleUrls: ["./pricing-settings.component.css"]
})
export class PricingSettingsComponent implements OnInit {
  detailForm: FormGroup = this.fb.group({
    minElligibleProcessProfile: [null],
    minElligiblePricingProfile: [null],
    presentBidNumberFromBottom: [null],
    incrementalMarginPercent: [null],
    incrementalMarginRate: [null],
    specificityPremium: [null],
    autoPricingEligibilityType: [null]
  });
  manualPricingSection = 3;

  defaultEligibilities = [
    {
      id: 1,
      name: "Based on Process Profiles",
      description:
        "Show all process profile with or without matching pricing profile"
    },
    {
      id: 2,
      name: "Based on Pricing Profiles",
      description: "Sort and filter based on pricing profiles"
    }
  ];
  selectedEligibility = 0;

  constructor(
    private fb: FormBuilder,
    private pricingService: RfqPricingService,
    private toastrService: ToastrService,
    private actionService: ActionService
  ) {}

  ngOnInit() {
    this.pricingService.getPricingSettings().subscribe(defaultValue => {
      this.detailForm.setValue(defaultValue);
    });
    this.actionService.saveProfileSettingAction().subscribe(() => {
      this.save();
    });
  }

  async save() {
    this.pricingService
      .setPricingSetting(this.detailForm.value)
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(v => {
        this.detailForm.setValue(v);
      });
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || 'Import Failed.';
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError("Error");
  }

  setManualPricingSection(newValue: number) {
    this.manualPricingSection = newValue;
  }
  setEligibility(newValue: number) {
    this.selectedEligibility = newValue;
    this.detailForm.value.autoPricingEligibilityType = this.defaultEligibilities[
      newValue
    ];
  }
}
