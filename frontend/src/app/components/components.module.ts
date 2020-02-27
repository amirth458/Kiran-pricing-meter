import { ModelDetailViewComponent } from './../common/model-detail-view/model-detail-view.component';
import { FileViewRendererComponent } from './../common/file-view-renderer/file-view-renderer.component';
import { StatusDropdownFilterComponent } from './../common/status-dropdown-filter/status-dropdown-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

import { ActionBarComponent } from '../common/action-bar/action-bar.component';
import { ActionCellApproveRendererComponent } from '../common/action-cell-approve-renderer/action-cell-approve-renderer.component';
import { ActionCellRendererComponent } from '../common/action-cell-renderer/action-cell-renderer.component';
import { ColumnSearchFilterComponent } from '../common/column-search-filter/column-search-filter.component';
import { DropdownCellRendererComponent } from '../common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { DropdownHeaderRendererComponent } from '../common/dropdown-header-renderer/dropdown-header-renderer.component';
import { MultiSelectCellEditorComponent } from '../common/multi-select-cell-editor/multi-select-cell-editor.component';
import { MultiSelectCellRendererComponent } from '../common/multi-select-cell-renderer/multi-select-cell-renderer.component';
import { SideMenuComponent } from '../common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from '../common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from '../common/top-menu/top-menu.component';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';
import { ImgPreloadDirective } from '../common/core/img-preload/img-preload.directive';

import { MarketplaceContainerComponent } from './vendor/marketplace/marketplace-container/marketplace-container.component';
import { ReferralContainerComponent } from './vendor/marketplace/referral/referral-container/referral-container.component';
import { ReferralComponent } from './vendor/marketplace/referral/referral/referral.component';
import { ReferralDetailsComponent } from './vendor/marketplace/referral/referral-details/referral-details.component';
import { PricingContainerComponent } from './vendor/pricing/pricing-container/pricing-container.component';
import { RfqContainerComponent } from './vendor/pricing/rfq/rfq-container/rfq-container.component';
import { PricingSettingsComponent } from './vendor/pricing/rfq/pricing-settings/pricing-settings.component';
import { RecentAutoPricesComponent } from './vendor/pricing/rfq/recent-auto-prices/recent-auto-prices.component';
import { QueuedManualPriceComponent } from './vendor/pricing/rfq/queued-manual-price/queued-manual-price.component';

import { AdminContainerComponent } from './admin/_container/container.component';
import { ApproveVendorComponent } from './admin/approve-vendor/approve-vendor.component';
import { AdminVendorDetailsContainerComponent } from './admin/vendor-details/_container/container.component';
import { AdminVendorDetailsActionBarComponent } from './admin/vendor-details/action-bar/action-bar.component';
import { AdminVendorDetailsUserComponent } from './admin/vendor-details/user/user.component';
import { AdminVendorDetailsVendorComponent } from './admin/vendor-details/vendor/vendor.component';
import { AdminVendorDetailsMachineComponent } from './admin/vendor-details/machine/machine.component';

import { TabItemComponent } from './../common/tabs/tab-item/tab-item.component';
import { TabComponent } from './../common/tabs/tab/tab.component';
import { FileViewerComponent } from './../common/file-viewer/file-viewer.component';
import { TemplateRendererComponent } from './../common/template-renderer/template-renderer.component';
import { PriceDetailComponent } from './vendor/pricing/rfq/price-detail/price-detail.component';
import { PriceViewComponent } from './vendor/pricing/rfq/price-view/price-view.component';
import { PartInformationComponent } from './vendor/pricing/rfq/part-information/part-information.component';
import { PricingProfileComponent } from './vendor/pricing/rfq/pricing-profile/pricing-profile.component';
import { PricingProfileDetailComponent } from './vendor/pricing/rfq/pricing-profile-detail/pricing-profile-detail.component';
import { RecommendedPricingComponent } from './vendor/pricing/rfq/recommended-pricing/recommended-pricing.component';
import { OrdersContainerComponent } from './vendor/pricing/orders/orders-container/orders-container.component';
import { FullfillmentSettingsComponent } from './vendor/pricing/orders/fullfillment-settings/fullfillment-settings.component';
import { SuborderReleaseQueueComponent } from './vendor/pricing/orders/suborder-release-queue/suborder-release-queue.component';
import { OrderConfirmQueueComponent } from './vendor/pricing/orders/order-confirm-queue/order-confirm-queue.component';
import { ReleasedOrdersComponent } from './vendor/pricing/orders/released-orders/released-orders.component';
import { CustomerOrderDetailsComponent } from './vendor/pricing/orders/customer-order-details/customer-order-details.component';
import { OrderInformationComponent } from './vendor/pricing/orders/order-information/order-information.component';
import { SubOrderInformationComponent } from './vendor/pricing/orders/sub-order-information/sub-order-information.component';
import { PastOrdersComponent } from './vendor/pricing/orders/past-orders/past-orders.component';
import { PastOrderDetailsComponent } from './vendor/pricing/orders/past-order-details/past-order-details.component';
import { VendorDetailsComponent } from './vendor/pricing/orders/vendor-details/vendor-details.component';
import { ProcessProfileComponent } from './vendor/pricing/rfq/process-profile/process-profile.component';
import { ProcessProfileDetailComponent } from './vendor/pricing/rfq/process-profile-detail/process-profile-detail.component';
import { BillingContainerComponent } from './vendor/billing/billing-container/billing-container.component';
import { PaymentContainerComponent } from './vendor/billing/payment-container/payment-container.component';
import { WaitingForApprovalComponent } from './vendor/billing/waiting-for-approval/waiting-for-approval.component';
import { PurchaseOrderItemComponent } from './vendor/billing/purchase-order-item/purchase-order-item.component';
import { PartItemDetailsComponent } from '../common/part-item-details/part-item-details.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    ActionCellApproveRendererComponent,
    ActionCellRendererComponent,
    ColumnSearchFilterComponent,
    DropdownCellRendererComponent,
    DropdownHeaderRendererComponent,
    MultiSelectCellEditorComponent,
    MultiSelectCellRendererComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    ProgressBarComponent,
    StatusDropdownFilterComponent,
    TabComponent,
    TabItemComponent,
    TemplateRendererComponent,
    FileViewerComponent,
    FileViewRendererComponent,
    ModelDetailViewComponent,

    AdminContainerComponent,
    ApproveVendorComponent,
    AdminVendorDetailsContainerComponent,
    AdminVendorDetailsActionBarComponent,
    AdminVendorDetailsUserComponent,
    AdminVendorDetailsVendorComponent,
    AdminVendorDetailsMachineComponent,

    MarketplaceContainerComponent,
    ReferralContainerComponent,
    ReferralComponent,
    ReferralDetailsComponent,
    PricingContainerComponent,
    RfqContainerComponent,
    PricingSettingsComponent,
    RecentAutoPricesComponent,
    QueuedManualPriceComponent,
    PriceDetailComponent,
    PriceViewComponent,
    PartInformationComponent,
    PricingProfileComponent,
    PricingProfileDetailComponent,
    RecommendedPricingComponent,
    OrdersContainerComponent,
    FullfillmentSettingsComponent,
    SuborderReleaseQueueComponent,
    OrderConfirmQueueComponent,
    ReleasedOrdersComponent,
    CustomerOrderDetailsComponent,
    OrderInformationComponent,
    SubOrderInformationComponent,
    PastOrdersComponent,
    PastOrderDetailsComponent,
    VendorDetailsComponent,
    ImgPreloadDirective,
    ProcessProfileComponent,
    ProcessProfileDetailComponent,
    BillingContainerComponent,
    PaymentContainerComponent,
    WaitingForApprovalComponent,
    PurchaseOrderItemComponent,
    PartItemDetailsComponent,
    WaitingForApprovalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    AgGridModule.withComponents([
      ActionCellRendererComponent,
      ActionCellApproveRendererComponent,
      DropdownCellRendererComponent,
      DropdownHeaderRendererComponent,
      MultiSelectCellRendererComponent,
      MultiSelectCellEditorComponent,
      StatusDropdownFilterComponent,
      TemplateRendererComponent,
      FileViewRendererComponent
    ]),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule,
    InternationalPhoneNumberModule
  ],
  providers: [DatePipe, CurrencyPipe],
  exports: [
    NgxSpinnerModule,
    AgGridModule,

    ActionBarComponent,
    ActionCellRendererComponent,
    ColumnSearchFilterComponent,
    MultiSelectCellRendererComponent,
    ProgressBarComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    ImgPreloadDirective
  ]
})
export class ComponentsModule {}
