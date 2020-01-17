import { UserService } from 'src/app/service/user.service';
import { CustomerData } from 'src/app/model/user.model';
import { RfqData, PartQuote } from './../../../../../model/part.model';
import { BehaviorSubject } from "rxjs";
import { RfqPricingService } from "../../../../../service/rfq-pricing.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Part } from "src/app/model/part.model";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-price-detail",
  templateUrl: "./price-detail.component.html",
  styleUrls: ["./price-detail.component.css"]
})
export class PriceDetailComponent implements OnInit {
  selectedId: number;
  part: Part;
  rfq: RfqData;
  partQuote: PartQuote;
  customer: CustomerData;

  tabs = [];

  selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pricingService: RfqPricingService,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe(params => {
      this.selectedId = params.partId;
      this.getDetails(this.selectedId);
    });

  }

  getDetails(id: number) {
    this.spinner.show();
    this.pricingService.getPartDetail(id).subscribe(part => {
      this.spinner.hide();
      this.part = part;
      this.tabs = [
        {
          id: 0,
          title: this.part && this.part.manualPricingAllowed
            ? "Manual-Price View"
            : "Auto-Price View"
        },
        {
          id: 1,
          title: "Part Information"
        },
        {
          id: 2,
          title: "Pricing Profile"
        }
      ];
      this.pricingService.getRfqDetail(this.part.rfqMedia.projectRfqId).subscribe((rfq) => {
        this.rfq = rfq;
      });
      this.userService.getCustomer(this.part.rfqMedia.media.customerId).subscribe((customer) => {
        this.customer = customer;
      });
      this.pricingService.getPartQuote(this.part.id).subscribe((partQuote) => {
        this.partQuote = partQuote;
      })
    });
  }

  manualQuote() {
    this.getDetails(this.selectedId);
  }

  ngOnInit() {}
}
