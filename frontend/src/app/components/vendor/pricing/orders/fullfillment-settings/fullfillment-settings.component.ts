import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-fullfillment-settings",
  templateUrl: "./fullfillment-settings.component.html",
  styleUrls: ["./fullfillment-settings.component.css"]
})
export class FullfillmentSettingsComponent implements OnInit {
  detailForm: FormGroup = this.fb.group({
    suppliersView: [5],
    timeIncrement: [20],
    startingPercent: [70],
    increaseAmountBy: [3],
    salePricePercent: [95],
    unresponsiveTime: [20]
  });

  cutOff = ['ITAR compliant programs', 'No Of Matched Supplier'];
  selectedCutOff = this.cutOff[0];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  async save(event) {}

  setCutOff(newValue: string) {
    this.selectedCutOff = newValue;
  }
}
