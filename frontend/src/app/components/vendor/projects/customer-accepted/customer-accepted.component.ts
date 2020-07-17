import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { BiddingService } from '../../../../service/bidding.service';
import { PmReleaseQueueComponent } from '../pm-release-queue/pm-release-queue.component';

@Component({
  selector: 'app-customer-accepted',
  templateUrl: './../pm-release-queue/pm-release-queue.component.html',
  styleUrls: ['./../pm-release-queue/pm-release-queue.component.css', './customer-accepted.component.css']
})
export class CustomerAcceptedComponent extends PmReleaseQueueComponent implements OnInit {
  constructor(public spinner: NgxSpinnerService, public router: Router, public biddingService: BiddingService) {
    super(spinner, router, biddingService);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
