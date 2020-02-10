import { OrdersService } from "./../../../../../service/orders.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ActionService } from "src/app/service/action.service";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { throwError } from "rxjs";

@Component({
  selector: "app-fullfillment-settings",
  templateUrl: "./fullfillment-settings.component.html",
  styleUrls: ["./fullfillment-settings.component.css"]
})
export class FullfillmentSettingsComponent implements OnInit {
  detailForm: FormGroup = this.fb.group({
    bidReleaseCutoffType: [null],
    maxSupplierViewOpportunity: [null],
    minBidIncreaseTimeMinutes: [null],
    initialBidSoldPricePercent: [null],
    incrementBidAmountPercent: [null],
    maxPercentWithoutFulfillment: [null],
    maxBidUnresponsiveTimeMinutes: [null]
  });

  cutOff = [
    {
      id: 1,
      name: "ITAR compliant programs",
      description: "ITAR compliant programs"
    },
    {
      id: 2,
      name: "No Of Matched Supplier",
      description: "No Of Matched Supplier"
    }
  ];
  selectedCutOff = 0;

  constructor(
    private fb: FormBuilder,
    public toastrService: ToastrService,
    public actionService: ActionService,
    public ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.ordersService.getFullfillmentSettings().subscribe(defaultValue => {
      if (defaultValue) {
        this.detailForm.setValue(defaultValue);
      }
    });
    this.actionService.saveFullfillmentSettingAction().subscribe(() => {
      this.save();
    });
  }

  async save() {
    this.ordersService
      .setFullfillmentSetting(this.detailForm.value)
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(v => {
        this.toastrService.success("Setting Saved Succesfully.");
        this.detailForm.setValue(v);
      });
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || "Import Failed.";
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError("Error");
  }

  setCutOff(newValue: number) {
    this.selectedCutOff = newValue;
    this.detailForm.value.bidReleaseCutoffType = this.cutOff[newValue];
  }
}
