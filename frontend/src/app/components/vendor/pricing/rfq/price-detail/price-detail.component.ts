import { BehaviorSubject } from 'rxjs';
import { RfqPricingService } from "../../../../../service/rfq-pricing.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-price-detail",
  templateUrl: "./price-detail.component.html",
  styleUrls: ["./price-detail.component.css"]
})
export class PriceDetailComponent implements OnInit {
  selectedId: number;
  type: string;
  pricingDetail: any;

  tabs = [];

  selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pricingService: RfqPricingService
  ) {
    this.route.params.subscribe(params => {
      this.selectedId = params.pricingId;
      this.type = params.type;
      this.getDetails(this.selectedId);
    });

    this.tabs = [
      {
        id: 0,
        title: this.type === undefined ? "Auto-Price View" : 'Manual-Price View'
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
  }

  async getDetails(id: number) {
    this.pricingDetail = await this.pricingService.getPricingDetail(id).toPromise();
  }

  ngOnInit() {}
}
