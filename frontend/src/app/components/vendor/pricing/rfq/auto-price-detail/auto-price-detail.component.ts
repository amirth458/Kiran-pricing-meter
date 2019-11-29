import { BehaviorSubject } from 'rxjs';
import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-auto-price-detail",
  templateUrl: "./auto-price-detail.component.html",
  styleUrls: ["./auto-price-detail.component.css"]
})
export class AutoPriceDetailComponent implements OnInit {
  selectedId: number;
  details: any;

  tabs = [
    {
      id: 0,
      title: "Auto-Price View"
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

  selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private pricingService: RfqPricingService
  ) {
    this.router.params.subscribe(params => {
      this.selectedId = params.id;
      this.getDetails(this.selectedId);
    });
  }

  async getDetails(id: number) {
    this.details = await this.pricingService.getAutoPricingDetail(id).toPromise();
  }

  ngOnInit() {}
}
