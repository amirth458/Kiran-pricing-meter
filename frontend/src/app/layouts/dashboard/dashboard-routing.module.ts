import { PricingProfileDetailComponent } from "./../../components/vendor/pricing/rfq/pricing-profile-detail/pricing-profile-detail.component";
import { PriceDetailComponent } from "../../components/vendor/pricing/rfq/price-detail/price-detail.component";
import { QueuedManualPriceComponent } from "./../../components/vendor/pricing/rfq/queued-manual-price/queued-manual-price.component";
import { RecentAutoPricesComponent } from "./../../components/vendor/pricing/rfq/recent-auto-prices/recent-auto-prices.component";
import { PricingSettingsComponent } from "./../../components/vendor/pricing/rfq/pricing-settings/pricing-settings.component";
import { RfqContainerComponent } from "./../../components/vendor/pricing/rfq/rfq-container/rfq-container.component";
import { PricingContainerComponent } from "./../../components/vendor/pricing/pricing-container/pricing-container.component";
import { ReferralDetailsComponent } from "./../../components/vendor/marketplace/referral/referral-details/referral-details.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";

import { MarketplaceContainerComponent } from "src/app/components/vendor/marketplace/marketplace-container/marketplace-container.component";
import { ReferralContainerComponent } from "./../../components/vendor/marketplace/referral/referral-container/referral-container.component";
import { ReferralComponent } from "./../../components/vendor/marketplace/referral/referral/referral.component";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      {
        path: "marketplace",
        component: ReferralContainerComponent,
        children: [
          { path: "referral", component: ReferralComponent },
          { path: "referral/:id", component: ReferralDetailsComponent },
          { path: "", redirectTo: "referral", pathMatch: "full" },
          { path: "**", redirectTo: "referral", pathMatch: "full" }
        ]
      },
      {
        path: "pricing",
        component: PricingContainerComponent,
        children: [
          {
            path: "rfq",
            component: RfqContainerComponent,
            children: [
              { path: "pricing-settings", component: PricingSettingsComponent },
              { path: "auto-prices", component: RecentAutoPricesComponent },
              { path: "auto-prices/:pricingId", component: PriceDetailComponent },
              {
                path: "auto-prices/:pricingId/pricing-profile/:profileId",
                component: PricingProfileDetailComponent
              },
              { path: "manual-price", component: QueuedManualPriceComponent },
              {
                path: "manual-price/:type/:pricingId",
                component: PriceDetailComponent
              },
              {
                path: "manual-price/:type/:pricingId",
                component: PriceDetailComponent
              },
              {
                path: "manual-price/:type/:pricingId/pricing-profile/:profileId",
                component: PricingProfileDetailComponent
              },
              { path: "", redirectTo: "pricing-settings", pathMatch: "full" },
              { path: "**", redirectTo: "pricing-settings", pathMatch: "full" }
            ]
          },
          { path: "", redirectTo: "rfq", pathMatch: "full" },
          { path: "**", redirectTo: "rfq", pathMatch: "full" }
        ]
      },
      { path: "", redirectTo: "marketplace", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
