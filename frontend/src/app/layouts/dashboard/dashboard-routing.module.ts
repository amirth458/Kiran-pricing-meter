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
      { path: "", redirectTo: "marketplace", pathMatch: "full" }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
