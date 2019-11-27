import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing-settings',
  templateUrl: './pricing-settings.component.html',
  styleUrls: ['./pricing-settings.component.css']
})
export class PricingSettingsComponent implements OnInit {
  detailForm: FormGroup = this.fb.group({
    eligibleProcessProfile: [null],
    eligiblePricingProfile: [null],
    presentBidNo: [null],
    percentIncremental: [null],
    amountIncremental: [null],
    percentOfSpecificity: [null],
  });
  manualPricingSection = 3;

  defaultEligibilities = [
    {
      name: 'Based on Process Profiles',
      description: '(Show all process profile with or without matching pricing profile)'
    }, {
      name: 'Based on Pricing Profiles',
      description: '(Sort and filter based on pricing profiles)'
    }
  ];
  selectedEligibility = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  async save(event) {}

  setManualPricingSection(newValue: number) {
    this.manualPricingSection = newValue;
  }
  setEligibility(newValue: number) {
    this.selectedEligibility = newValue;
  }
}
