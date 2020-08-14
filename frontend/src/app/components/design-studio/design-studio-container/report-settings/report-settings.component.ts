import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { ToastrService } from 'ngx-toastr';
import { ActionService } from 'src/app/service/action.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/service/report.service';
import { ReportSetting } from 'src/app/model/report.model';

@Component({
  selector: 'app-report-settings',
  templateUrl: './report-settings.component.html',
  styleUrls: ['./report-settings.component.css']
})
export class ReportSettingsComponent implements OnInit {
  settings: ReportSetting[] = [];

  constructor(
    private reportService: ReportService,
    private toastrService: ToastrService,
    private actionService: ActionService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.initSettings();
    this.actionService.saveReportSettingAction().subscribe(() => {
      this.save();
    });
  }

  addSetting() {
    this.settings.push({
      id: null,
      reportType: null,
      listPrice: null,
      currentPrice: null
    });
  }

  removeSetting(index) {
    this.settings.splice(index, 1);
  }

  initSettings() {
    this.spinner.show();
    this.reportService
      .getReportSettings()
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(res => {
        this.settings = res || [];
        if (this.settings.length === 0) {
          this.addSetting();
        }
        this.spinner.hide();
      });
  }

  async save() {
    const hasErrors = this.settings.some(row => !row.reportType || !row.currentPrice || !row.listPrice);

    if (hasErrors) {
      this.toaster.warning('Please Fill All Required Fields');
      return;
    }

    this.spinner.show();
    this.reportService
      .updateReportSettings(this.settings)
      .pipe(catchError(e => this.handleSaveError(e)))
      .subscribe(res => {
        this.settings = res;
        this.spinner.hide();
        this.toastrService.success(`Pricing Settings Updated Successfully`);
      });
  }

  handleSaveError(error: HttpErrorResponse) {
    this.spinner.hide();
    console.log(error);
    return throwError('Error');
  }
}
