import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest } from 'rxjs';

import { BiddingService } from '../../../../service/bidding.service';
import { BidPart } from '../../../../model/part.model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  offerId: number;
  vendorId: number;
  proposalInfo: BidPart[];

  get totalCost() {
    return (this.proposalInfo || []).reduce((sum: number, part: BidPart) => {
      const quote = part.partQuoteCustomerView;
      sum += quote.totalCost || 0;
      return sum;
    }, 0);
  }

  constructor(public route: Router, public router: ActivatedRoute, public biddingService: BiddingService) {
    combineLatest(this.router.params, this.router.parent.params).subscribe(v => {
      const params: any = { ...v[0], ...v[1] };
      this.offerId = params.bidPmProjectId || null;
      this.vendorId = params.vendorId || null;
    });
  }

  ngOnInit() {
    this.getVendorProposal();
  }

  getVendorProposal() {
    this.biddingService.getDetailedPartInfo(this.offerId, this.vendorId).subscribe(offerInfo => {
      this.proposalInfo = offerInfo || [];
    });
  }
}
