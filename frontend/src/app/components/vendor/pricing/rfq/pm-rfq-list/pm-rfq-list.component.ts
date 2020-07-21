import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { ProjectService } from '../../../../../service/project.service';
import { ProjectTypeEnum } from '../../../../../model/order.model';
import { PartService } from '../../../../../service/part.service';
import { RfqListComponent } from '../rfq-list/rfq-list.component';
import { RfqTypeEnum } from '../../../../../model/part.model';

@Component({
  selector: 'app-pm-rfq-list',
  templateUrl: './../rfq-list/rfq-list.component.html',
  styleUrls: ['./../rfq-list/rfq-list.component.css', './pm-rfq-list.component.css']
})
export class PmRfqListComponent extends RfqListComponent implements OnInit {
  rfqType = RfqTypeEnum.PM_RFQ;
  projectType = ProjectTypeEnum.PRODUCTION_PROJECT;

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public projectService: ProjectService,
    public partService: PartService,
    public modalService: NgbModal,
    public datePipe: DatePipe
  ) {
    super(spinner, router, projectService, partService, modalService, datePipe);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}