import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { Observable } from 'rxjs';

import { FilterOption } from '../../../../../model/vendor.model';
import { ProjectService } from '../../../../../service/project.service';
import { ProjectTypeEnum } from '../../../../../model/order.model';
import { RfqListComponent } from '../rfq-list/rfq-list.component';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { RfqFilter, RfqTypeEnum } from '../../../../../model/part.model';

@Component({
  selector: 'app-pm-program-rfq-list',
  templateUrl: './../rfq-list/rfq-list.component.html',
  styleUrls: ['./../rfq-list/rfq-list.component.css', './pm-program-rfq-list.component.css']
})
export class PmProgramRfqListComponent extends RfqListComponent implements OnInit {
  rfqType = RfqTypeEnum.PM_PROGRAM_RFQ;
  projectType = ProjectTypeEnum.PRODUCTION_PROJECT;

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public projectService: ProjectService,
    public rfqPricingService: RfqPricingService,
    public modalService: NgbModal,
    public datePipe: DatePipe
  ) {
    super(spinner, router, projectService, rfqPricingService, modalService, datePipe);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public filterData(req: FilterOption, form: RfqFilter): Observable<any> {
    return this.projectService.searchPmProgramRfq(req, form);
  }
}
