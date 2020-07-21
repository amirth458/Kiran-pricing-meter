import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BiddingService } from '../../../../service/bidding.service';
import { PartService } from '../../../../service/part.service';
import { PmReleaseQueueComponent } from '../pm-release-queue/pm-release-queue.component';
import { PmProjectStatusEnum, PmProjectStatusType } from '../../../../model/bidding.order';

@Component({
  selector: 'app-issued-proposal',
  templateUrl: './../pm-release-queue/pm-release-queue.component.html',
  styleUrls: ['./../pm-release-queue/pm-release-queue.component.css', './issued-proposal.component.css']
})
export class IssuedProposalComponent extends PmReleaseQueueComponent implements OnInit {
  protected bidPmProjectStatusIds = [PmProjectStatusEnum.RELEASED_TO_CUSTOMER];
  protected pmProjectStatusType = PmProjectStatusType.PROPOSAL_ISSUED;

  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public biddingService: BiddingService,
    public partService: PartService,
    public modalService: NgbModal
  ) {
    super(spinner, router, biddingService, partService, modalService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}