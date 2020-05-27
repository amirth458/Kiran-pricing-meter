import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { ActionService } from 'src/app/service/action.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-connect-setting',
  templateUrl: './connect-setting.component.html',
  styleUrls: ['./connect-setting.component.css']
})
export class ConnectSettingComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
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
    this.actionService.saveProductionSettingAction().subscribe(() => {
      this.save();
    });
  }

  initSettings() {
    this.spinner.show();

    this.pricingService
      .getProductionPricingSettings()
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(a => {
        this.formGroup.setValue({ ...this.formGroup.value, baseCost: a.baseCost, fee: a.fee });
        this.spinner.hide();
      });
  }

  async save() {
    if (this.formGroup.valid) {
      this.spinner.show();
      this.pricingService
        .setProductionPricingSetting({
          baseCost: this.formGroup.value.baseCost,
          fee: this.formGroup.value.fee
        })
        .pipe(catchError(e => this.handleSaveError(e)))
        .subscribe(a => {
          this.spinner.hide();
          this.formGroup.setValue({ ...this.formGroup.value, baseCost: a.baseCost, fee: a.fee });
          this.toastrService.success(`Pricing Settings Updated Successfully`);
        });
    } else {
      this.toastrService.warning('Invalid form.');
    }
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || 'Import Failed.';
    this.toastrService.error(`${message} Please contact your admin`);
    this.spinner.hide();
    return throwError('Error');
  }
}
