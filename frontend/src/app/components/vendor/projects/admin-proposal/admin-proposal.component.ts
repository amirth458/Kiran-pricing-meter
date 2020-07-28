import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BiddingService } from '../../../../service/bidding.service';
import { MetadataService } from '../../../../service/metadata.service';
import { OrdersService } from '../../../../service/orders.service';
import { ProposalTypeEnum } from '../../../../model/bidding.order';
import { ProposalComponent } from '../proposal/proposal.component';
import { ProposalService } from '../../../../service/proposal.service';
import { UserService } from 'src/app/service/user.service';
import { RfqPricingService } from '../../../../service/rfq-pricing.service';

@Component({
  selector: 'app-admin-proposal',
  templateUrl: './../proposal/proposal.component.html',
  styleUrls: ['./../proposal/proposal.component.css', './admin-proposal.component.css']
})
export class AdminProposalComponent extends ProposalComponent implements OnInit {
  proposalType = ProposalTypeEnum.ADMIN_PROPOSAL_TYPE;

  constructor(
    public route: Router,
    public router: ActivatedRoute,
    public biddingService: BiddingService,
    public metaDataService: MetadataService,
    public proposalService: ProposalService,
    public orderService: OrdersService,
    public toasterService: ToastrService,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public userService: UserService,
    protected pricingService: RfqPricingService
  ) {
    super(
      route,
      router,
      biddingService,
      metaDataService,
      proposalService,
      orderService,
      toasterService,
      spinner,
      modalService,
      userService,
      pricingService
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
