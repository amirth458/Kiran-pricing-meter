import { VendorDetailsComponent } from './../../components/vendor/pricing/orders/vendor-details/vendor-details.component';
import { CustomerOrderDetailsComponent } from './../../components/vendor/pricing/orders/customer-order-details/customer-order-details.component';
import { ReleasedOrdersComponent } from './../../components/vendor/pricing/orders/released-orders/released-orders.component';
import { OrderConfirmQueueComponent } from './../../components/vendor/pricing/orders/order-confirm-queue/order-confirm-queue.component';
import { SuborderReleaseQueueComponent } from './../../components/vendor/pricing/orders/suborder-release-queue/suborder-release-queue.component';
import { FullfillmentSettingsComponent } from './../../components/vendor/pricing/orders/fullfillment-settings/fullfillment-settings.component';
import { OrdersContainerComponent } from './../../components/vendor/pricing/orders/orders-container/orders-container.component';
import { PricingProfileDetailComponent } from './../../components/vendor/pricing/rfq/pricing-profile-detail/pricing-profile-detail.component';
import { PriceDetailComponent } from '../../components/vendor/pricing/rfq/price-detail/price-detail.component';
import { QueuedManualPriceComponent } from './../../components/vendor/pricing/rfq/queued-manual-price/queued-manual-price.component';
import { RecentAutoPricesComponent } from './../../components/vendor/pricing/rfq/recent-auto-prices/recent-auto-prices.component';
import { PricingSettingsComponent } from './../../components/vendor/pricing/rfq/pricing-settings/pricing-settings.component';
import { RfqContainerComponent } from './../../components/vendor/pricing/rfq/rfq-container/rfq-container.component';
import { PricingContainerComponent } from './../../components/vendor/pricing/pricing-container/pricing-container.component';
import { ReferralDetailsComponent } from './../../components/vendor/marketplace/referral/referral-details/referral-details.component';

import { AdminContainerComponent } from './../../components/admin/_container/container.component';
import { ApproveVendorComponent } from './../../components/admin/approve-vendor/approve-vendor.component';
import { AdminVendorDetailsContainerComponent } from './../../components/admin/vendor-details/_container/container.component';
import { AdminVendorDetailsUserComponent } from './../../components/admin/vendor-details/user/user.component';
import { AdminVendorDetailsVendorComponent } from './../../components/admin/vendor-details/vendor/vendor.component';
import { AdminVendorDetailsMachineComponent } from './../../components/admin/vendor-details/machine/machine.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { ReferralContainerComponent } from './../../components/vendor/marketplace/referral/referral-container/referral-container.component';
import { ReferralComponent } from './../../components/vendor/marketplace/referral/referral/referral.component';
import { ProcessProfileDetailComponent } from 'src/app/components/vendor/pricing/rfq/process-profile-detail/process-profile-detail.component';
import { BillingContainerComponent } from 'src/app/components/vendor/billing/billing-container/billing-container.component';
import { PaymentContainerComponent } from 'src/app/components/vendor/billing/payment-container/payment-container.component';
import { WaitingForApprovalComponent } from 'src/app/components/vendor/billing/waiting-for-approval/waiting-for-approval.component';
import { PurchaseOrderItemComponent } from 'src/app/components/vendor/billing/purchase-order-item/purchase-order-item.component';
import { ProjectsContainerComponent } from 'src/app/components/vendor/projects/projects-container/projects-container.component';
import { OrderDetailComponent } from 'src/app/components/vendor/projects/order-detail/order-detail.component';
import { CustomersComponent } from 'src/app/components/admin/customers/customers.component';
import { CustomerViewComponent } from 'src/app/components/admin/customer-view/customer-view.component';
import { ContactComponent } from 'src/app/components/admin/contact/contact.component';
import { PasswordComponent } from 'src/app/components/admin/password/password.component';
import { ShippingComponent } from 'src/app/components/admin/shipping/shipping.component';
import { ProjectsListComponent } from 'src/app/components/vendor/projects/projects-list/projects-list.component';

import { InsightContainerComponent } from './../../components/vendor/insight/insight-container/insight-container.component';
import { InsightCustomersComponent } from './../../components/vendor/insight/insight-customers/insight-customers.component';
import { InsightVendorsComponent } from './../../components/vendor/insight/insight-vendors/insight-vendors.component';
// import { InsightNewUsersComponent } from './../../components/vendor/insight/insight-new-users/insight-new-users.component';
import { InsightFacilityComponent } from './../../components/vendor/insight/insight-facility/insight-facility.component';
import { InsightRfqComponent } from './../../components/vendor/insight/insight-rfq/insight-rfq.component';
import { InsightPartComponent } from './../../components/vendor/insight/insight-part/insight-part.component';
import { InsightBidComponent } from './../../components/vendor/insight/insight-bid/insight-bid.component';
import { InsightOrderComponent } from './../../components/vendor/insight/insight-order/insight-order.component';
import { InsightProcessProfileComponent } from './../../components/vendor/insight/insight-process-profile/insight-process-profile.component';
import { InsightPricingProfileComponent } from './../../components/vendor/insight/insight-pricing-profile/insight-pricing-profile.component';
import { ProductionOrdersContainerComponent } from 'src/app/components/vendor/pricing/production-orders/production-orders-container/production-orders-container.component';
import { ProductionVendorDetailsComponent } from 'src/app/components/vendor/pricing/production-orders/production-vendor-details/production-vendor-details.component';
import { ProductionReleasedOrdersComponent } from 'src/app/components/vendor/pricing/production-orders/production-released-orders/production-released-orders.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'marketplace',
        component: ReferralContainerComponent,
        children: [
          { path: 'referral', component: ReferralComponent },
          { path: 'referral/:id', component: ReferralDetailsComponent },
          { path: '', redirectTo: 'referral', pathMatch: 'full' },
          { path: '**', redirectTo: 'referral', pathMatch: 'full' }
        ]
      },
      {
        path: 'pricing',
        component: PricingContainerComponent,
        children: [
          {
            path: 'rfq',
            component: RfqContainerComponent,
            children: [
              { path: 'pricing-settings', component: PricingSettingsComponent },
              { path: 'auto-prices', component: RecentAutoPricesComponent },
              {
                path: 'auto-prices/:partId',
                component: PriceDetailComponent
              },
              {
                path: 'auto-prices/:partId/pricing-profile/:profileId',
                component: PricingProfileDetailComponent
              },
              {
                path: 'auto-prices/:partId/process-profile/:profileId',
                component: ProcessProfileDetailComponent
              },
              { path: 'manual-price', component: QueuedManualPriceComponent },
              {
                path: 'manual-price/:partId',
                component: PriceDetailComponent
              },
              {
                path: 'manual-price/:partId/process-profile/:profileId',
                component: ProcessProfileDetailComponent
              },
              {
                path: 'manual-price/:partId/pricing-profile/:profileId',
                component: PricingProfileDetailComponent
              },
              { path: '', redirectTo: 'pricing-settings', pathMatch: 'full' },
              { path: '**', redirectTo: 'pricing-settings', pathMatch: 'full' }
            ]
          },
          {
            path: 'orders',
            component: OrdersContainerComponent,
            children: [
              {
                path: 'fullfillment-settings',
                component: FullfillmentSettingsComponent
              },
              {
                path: 'suborder-release-queue',
                component: SuborderReleaseQueueComponent
              },
              {
                path: 'suborder-release-queue/order/:partId',
                component: CustomerOrderDetailsComponent
              },
              {
                path: 'order-confirmation-queue',
                component: OrderConfirmQueueComponent
              },
              {
                path: 'suborder-release-queue/vendor',
                component: VendorDetailsComponent
              },
              {
                path: 'order-confirmation-queue/:bidOrderId',
                component: VendorDetailsComponent
              },
              {
                path: 'released-orders/:bidOrderId',
                component: VendorDetailsComponent
              },
              { path: 'released-orders', component: ReleasedOrdersComponent },
              {
                path: '',
                redirectTo: 'fullfillment-settings',
                pathMatch: 'full'
              },
              {
                path: '**',
                redirectTo: 'fullfillment-settings',
                pathMatch: 'full'
              }
            ]
          },
          {
            path: 'production-orders',
            component: ProductionOrdersContainerComponent,
            children: [
              {
                path: 'released-orders/:bidOrderId',
                component: ProductionVendorDetailsComponent
              },
              { path: 'released-orders', component: ProductionReleasedOrdersComponent },
              {
                path: '',
                redirectTo: 'released-orders',
                pathMatch: 'full'
              },
              {
                path: '**',
                redirectTo: 'released-orders',
                pathMatch: 'full'
              }
            ]
          },
          { path: '', redirectTo: 'rfq', pathMatch: 'full' },
          { path: '**', redirectTo: 'rfq', pathMatch: 'full' }
        ]
      },
      {
        path: 'user-manage',
        component: AdminContainerComponent,
        children: [
          {
            path: 'approve-vendor',
            component: ApproveVendorComponent
          },
          {
            path: 'vendor-details/:vendorId',
            component: AdminVendorDetailsContainerComponent,
            children: [
              { path: 'user', component: AdminVendorDetailsUserComponent },
              { path: 'vendor', component: AdminVendorDetailsVendorComponent },
              { path: 'machine', component: AdminVendorDetailsMachineComponent }
            ]
          },
          {
            path: 'customers',
            component: CustomersComponent
          },
          {
            path: 'customers/view',
            component: CustomerViewComponent,
            children: [
              { path: 'user', component: ContactComponent },
              { path: 'contact', component: PasswordComponent },
              { path: 'shipping', component: ShippingComponent },
              { path: '', redirectTo: 'user', pathMatch: 'full' },
              { path: '**', redirectTo: 'user', pathMatch: 'full' }
            ]
          },
          { path: '', pathMatch: 'full', redirectTo: 'approve-vendor' },
          { path: '**', pathMatch: 'full', redirectTo: 'approve-vendor' }
        ]
      },
      {
        path: 'billing',
        component: BillingContainerComponent,
        children: [
          {
            path: 'payment',
            component: PaymentContainerComponent,
            children: [
              {
                path: 'waiting-for-approval',
                component: WaitingForApprovalComponent
              },
              { path: 'approved', component: WaitingForApprovalComponent },
              { path: 'rejected', component: WaitingForApprovalComponent },
              { path: 'details/:id', component: PurchaseOrderItemComponent },
              {
                path: '',
                redirectTo: 'waiting-for-approval',
                pathMatch: 'full'
              },
              {
                path: '**',
                redirectTo: 'waiting-for-approval',
                pathMatch: 'full'
              }
            ]
          },
          { path: '', redirectTo: 'payment', pathMatch: 'full' },
          { path: '**', redirectTo: 'payment', pathMatch: 'full' }
        ]
      },
      {
        path: 'projects',
        component: ProjectsContainerComponent,
        children: [
          {
            path: 'project-release-queue',
            component: ProjectsListComponent
          },
          {
            path: 'project-release-queue/:id',
            component: OrderDetailComponent
          },
          {
            path: 'vendor-confirmation-queue',
            component: ProjectsListComponent
          },
          {
            path: 'vendor-confirmation-queue/:id',
            component: OrderDetailComponent
          },
          {
            path: 'released-projects',
            component: ProjectsListComponent
          },
          {
            path: 'released-projects/:id',
            component: OrderDetailComponent
          },
          {
            path: '',
            redirectTo: 'project-release-queue'
          }
        ]
      },
      {
        path: 'insight',
        component: InsightContainerComponent,
        children: [
          { path: 'customers', component: InsightCustomersComponent },
          { path: 'vendors', component: InsightVendorsComponent },
          // { path: 'new-users', component: InsightNewUsersComponent },
          { path: 'facility', component: InsightFacilityComponent },
          { path: 'rfq', component: InsightRfqComponent },
          { path: 'part', component: InsightPartComponent },
          { path: 'bid', component: InsightBidComponent },
          { path: 'order', component: InsightOrderComponent },
          { path: 'process-profile', component: InsightProcessProfileComponent },
          { path: 'pricing-profile', component: InsightPricingProfileComponent },
          {
            path: '',
            redirectTo: 'customers'
          }
        ]
      },
      { path: '', redirectTo: 'pricing', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
