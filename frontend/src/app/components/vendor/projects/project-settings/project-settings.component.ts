import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { ActionService } from 'src/app/service/action.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css']
})
export class ProjectSettingsComponent implements OnInit {
  formGroup: FormGroup = this.fb.group({
    baseCost: [null],
    fee: [null]
  });

  constructor(
    private fb: FormBuilder,
    private pricingService: RfqPricingService,
    private toastrService: ToastrService,
    private actionService: ActionService
  ) {}

  ngOnInit() {
    this.initSettings();
    this.actionService.saveProjectSettingAction().subscribe(() => {
      this.save();
    });
  }

  initSettings() {
    this.pricingService.getProductionPricingSettings().subscribe(defaultValue => {
      if (defaultValue) {
        this.formGroup.setValue({ baseCost: defaultValue.baseCost, fee: defaultValue.fee });
      }
    });
  }

  async save() {
    this.pricingService
      .setProductionPricingSetting(this.formGroup.value)
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(v => {
        this.initSettings();
        this.toastrService.success(`Pricing Settings Updated Successfully`);
      });
  }

  handleSaveError(error: HttpErrorResponse) {
    const message = error.error.message || 'Import Failed.';
    this.toastrService.error(`${message} Please contact your admin`);
    return throwError('Error');
  }
}