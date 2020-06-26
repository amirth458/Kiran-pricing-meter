import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { ActionService } from 'src/app/service/action.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectTypeEnum } from 'src/app/model/order.model';

@Component({
  selector: 'app-connect-setting',
  templateUrl: './connect-setting.component.html',
  styleUrls: ['./connect-setting.component.css']
})
export class ConnectSettingComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    numberOfCustomerSupplierToSelect: [null, Validators.required],
    baseCost: [null, Validators.required],
    fee: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private pricingService: RfqPricingService,
    private toastrService: ToastrService,
    private actionService: ActionService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.initSettings();
    this.actionService.saveConnectSettingAction().subscribe(() => {
      this.save();
    });
  }

  initSettings() {
    this.spinner.show();

    combineLatest(
      this.pricingService.getProductionPricingSettings(ProjectTypeEnum.CONNECT_PROJECT),
      this.pricingService.getConnectSetting()
    )
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(([a, b]) => {
        this.formGroup.setValue({
          ...this.formGroup.value,
          baseCost: a.baseCost,
          fee: a.fee,
          numberOfCustomerSupplierToSelect: b.numberOfCustomerSupplierToSelectPerRfq
        });
        this.spinner.hide();
      });
  }

  async save() {
    if (this.formGroup.valid) {
      this.spinner.show();
      combineLatest(
        this.pricingService.setProductionPricingSetting(
          {
            baseCost: this.formGroup.value.baseCost,
            fee: this.formGroup.value.fee
          },
          ProjectTypeEnum.CONNECT_PROJECT
        ),
        this.pricingService.updateConnectSetting(this.formGroup.value.numberOfCustomerSupplierToSelect)
      )
        .pipe(catchError(e => this.handleSaveError(e)))
        .subscribe(([a, b]) => {
          this.spinner.hide();
          this.formGroup.setValue({
            ...this.formGroup.value,
            baseCost: a.baseCost,
            fee: a.fee,
            numberOfCustomerSupplierToSelect: b.numberOfCustomerSupplierToSelectPerRfq
          });
          this.toastrService.success(`Pricing Settings Updated Successfully`);
        });
    } else {
      this.toastrService.warning('Invalid form.');
    }
  }

  handleSaveError(error: HttpErrorResponse) {
    this.spinner.hide();
    console.log(error);
    return throwError('Error');
  }
}
