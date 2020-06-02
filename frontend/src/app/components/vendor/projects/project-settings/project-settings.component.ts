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
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css']
})
export class ProjectSettingsComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    baseCost: [0, [Validators.min(0), Validators.required]],
    fee: [0, [Validators.min(0), Validators.required]],
    minNumberOfSupplierToRelease: [0, [Validators.min(0), Validators.required]],
    minimumNumberOfQualifiedSupplier: [0, [Validators.min(0), Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private pricingService: RfqPricingService,
    private toastrService: ToastrService,
    private actionService: ActionService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.formGroup.get('minimumNumberOfQualifiedSupplier').setValidators(val => {
      return val.value > 0 && val.value <= this.formGroup.value.minNumberOfSupplierToRelease ? null : { invalid: true };
    });
    this.formGroup.get('minNumberOfSupplierToRelease').valueChanges.subscribe(r => {
      this.formGroup.get('minimumNumberOfQualifiedSupplier').updateValueAndValidity();
    });
    this.initSettings();
    this.actionService.saveProductionSettingAction().subscribe(() => {
      this.save();
    });
  }

  initSettings() {
    this.spinner.show();
    combineLatest([
      this.pricingService.getProductionPricingSettings().pipe(catchError(e => this.handleSaveError(e))),
      this.pricingService.getProductionProjectSetting().pipe(catchError(e => this.handleSaveError(e)))
    ]).subscribe(([a, b]) => {
      if (a) {
        this.formGroup.setValue({ ...this.formGroup.value, baseCost: a.baseCost, fee: a.fee });
      }
      if (b) {
        this.formGroup.setValue({
          ...this.formGroup.value,
          minNumberOfSupplierToRelease: b.minNumberOfSupplierToRelease,
          minimumNumberOfQualifiedSupplier: b.minimumNumberOfQualifiedSupplier
        });
        this.formGroup.get('minimumNumberOfQualifiedSupplier').updateValueAndValidity();
      }
      this.spinner.hide();
    });
  }

  async save() {
    this.formGroup.get('minimumNumberOfQualifiedSupplier').updateValueAndValidity();

    if (this.formGroup.valid && !this.formGroup.get('minimumNumberOfQualifiedSupplier').hasError('invalid')) {
      this.spinner.show();
      combineLatest([
        this.pricingService
          .setProductionPricingSetting({
            baseCost: this.formGroup.value.baseCost,
            fee: this.formGroup.value.fee
          })
          .pipe(catchError(e => this.handleSaveError(e))),
        this.pricingService
          .updateProductionProjectSetting(
            this.formGroup.value.minNumberOfSupplierToRelease,
            this.formGroup.value.minimumNumberOfQualifiedSupplier
          )
          .pipe(catchError(e => this.handleSaveError(e)))
      ]).subscribe(([a, b]) => {
        this.spinner.hide();
        if (a) {
          this.formGroup.setValue({ ...this.formGroup.value, baseCost: a.baseCost, fee: a.fee });
        }
        if (b) {
          this.formGroup.setValue({
            ...this.formGroup.value,
            minNumberOfSupplierToRelease: b.minNumberOfSupplierToRelease,
            minimumNumberOfQualifiedSupplier: b.minimumNumberOfQualifiedSupplier
          });
        }
        this.toastrService.success(`Pricing Settings Updated Successfully`);
      });
    } else {
      if (this.formGroup.get('minimumNumberOfQualifiedSupplier').hasError('invalid')) {
        this.toastrService.warning(
          'Minimum number of qualified suppliers to match <= Minimum number of qualified suppliers to release'
        );
      } else {
        this.toastrService.warning('Invalid form.');
      }
    }
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || 'Import Failed.';
    this.toastrService.error(`${message} Please contact your admin`);
    this.spinner.hide();
    return throwError('Error');
  }
}
