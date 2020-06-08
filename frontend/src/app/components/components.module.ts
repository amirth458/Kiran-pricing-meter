import { ModelDetailViewComponent } from '../common/model-detail-view/model-detail-view.component';
import { FileViewRendererComponent } from '../common/file-view-renderer/file-view-renderer.component';
import { StatusDropdownFilterComponent } from '../common/status-dropdown-filter/status-dropdown-filter.component';
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
import { ChatModule } from './chat/chat.module';

import { ActionBarComponent } from '../common/action-bar/action-bar.component';
import { ActionCellApproveRendererComponent } from '../common/action-cell-approve-renderer/action-cell-approve-renderer.component';
import { ActionCellRendererComponent } from '../common/action-cell-renderer/action-cell-renderer.component';
import { ColumnSearchFilterComponent } from '../common/column-search-filter/column-search-filter.component';
import { DropdownCellRendererComponent } from '../common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { DropdownHeaderRendererComponent } from '../common/dropdown-header-renderer/dropdown-header-renderer.component';
import { MultiSelectCellEditorComponent } from '../common/multi-select-cell-editor/multi-select-cell-editor.component';
import { MultiSelectCellRendererComponent } from '../common/multi-select-cell-renderer/multi-select-cell-renderer.component';
import { PartInformationComponent } from '../common/part-information/part-information.component';
import { SideMenuComponent } from '../common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from '../common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from '../common/top-menu/top-menu.component';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';
import { CheckBoxComponent } from '../common/check-box/check-box.component';
import { ImgPreloadDirective } from '../common/core/img-preload/img-preload.directive';
import { DigitOnlyDirective } from '../common/core/digit-only/digit-only.directive';

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

import { TabItemComponent } from '../common/tabs/tab-item/tab-item.component';
import { TabComponent } from '../common/tabs/tab/tab.component';
import { FileViewerComponent } from '../common/file-viewer/file-viewer.component';
import { TemplateRendererComponent } from '../common/template-renderer/template-renderer.component';
import { PriceDetailComponent } from './vendor/pricing/rfq/price-detail/price-detail.component';
import { PriceViewComponent } from './vendor/pricing/rfq/price-view/price-view.component';
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

// pipes
import { ConfirmOrderFilterPipe } from '../pipes/confirm-order-filter.pipe';
import { SupplierPipe } from '../pipes/supplier.pipe';
import { HistoricalBidComponent } from './vendor/pricing/rfq/historical-bid/historical-bid.component';
import { ProjectsContainerComponent } from './vendor/projects/projects-container/projects-container.component';
import { OrderDetailComponent } from './vendor/projects/order-detail/order-detail.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { CustomerViewComponent } from './admin/customer-details/customer-view/customer-view.component';
import { PasswordComponent } from './admin/customer-details/password/password.component';
import { ShippingComponent } from './admin/customer-details/shipping/shipping.component';
import { ContactComponent } from './admin/customer-details/contact/contact.component';
import { ProjectsListComponent } from './vendor/projects/projects-list/projects-list.component';
import { SendMailModalComponent } from '../common/send-mail-modal/send-mail-modal.component';
import { VendorOrderStatusComponent } from './vendor/pricing/orders/vendor-order-status/vendor-order-status.component';

// chats
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SubscriptionModalComponent } from '../common/subscription-modal/subscription-modal.component';
import { InsightContainerComponent } from './vendor/insight/insight-container/insight-container.component';
import { InsightHeaderComponent } from './vendor/insight/insight-header/insight-header.component';
import { InsightGridComponent } from './vendor/insight/insight-grid/insight-grid.component';
import { InsightCustomersComponent } from './vendor/insight/insight-customer/insight-customers/insight-customers.component';
import { InsightVendorsComponent } from './vendor/insight/insight-vendor/insight-vendors/insight-vendors.component';
import { InsightFacilityComponent } from './vendor/insight/insight-vendor/insight-facility/insight-facility.component';
import { InsightRfqComponent } from './vendor/insight/insight-customer/insight-rfq/insight-rfq.component';
import { InsightPartComponent } from './vendor/insight/insight-customer/insight-part/insight-part.component';
import { InsightProcessProfileComponent } from './vendor/insight/insight-vendor/insight-process-profile/insight-process-profile.component';
import { InsightPricingProfileComponent } from './vendor/insight/insight-vendor/insight-pricing-profile/insight-pricing-profile.component';
import { InsightDetailComponent } from './vendor/insight/insight-detail/insight-detail.component';
import { SearchBarComponent } from '../common/search-bar/search-bar.component';
import { DateRangeMonthComponent } from '../common/date-range-month/date-range-month.component';
import { MultiPartsInformationComponent } from '../common/multi-parts-information/multi-parts-information.component';
import { ProductionOrdersContainerComponent } from './vendor/pricing/production-orders/production-orders-container/production-orders-container.component';
import { ProductionReleasedOrdersComponent } from './vendor/pricing/production-orders/production-released-orders/production-released-orders.component';
import { ProductionVendorDetailsComponent } from './vendor/pricing/production-orders/production-vendor-details/production-vendor-details.component';
import { BillingChatComponent } from './vendor/billing/billing-chat/billing-chat.component';
import { ViewInThreeDComponent } from '../common/view-in-three-d/view-in-three-d.component';
import { InsightVendorContainerComponent } from './vendor/insight/insight-vendor/insight-vendor-container/insight-vendor-container.component';
import { InsightCustomerContainerComponent } from './vendor/insight/insight-customer/insight-customer-container/insight-customer-container.component';
import { InsightAdminContainerComponent } from './vendor/insight/insight-admin/insight-admin-container/insight-admin-container.component';
import { InsightQuoteComponent } from './vendor/insight/insight-admin/insight-quote/insight-quote.component';
import { InsightBidorderComponent } from './vendor/insight/insight-admin/insight-bidorder/insight-bidorder.component';
import { InsightBidorderitemComponent } from './vendor/insight/insight-admin/insight-bidorderitem/insight-bidorderitem.component';
import { InsightBidprocessComponent } from './vendor/insight/insight-admin/insight-bidprocess/insight-bidprocess.component';
import { InsightVendorOrderComponent } from './vendor/insight/insight-vendor/insight-vendor-order/insight-vendor-order.component';
import { InsightVendorSuborderComponent } from './vendor/insight/insight-vendor/insight-vendor-suborder/insight-vendor-suborder.component';
import { InsightCustomerSuborderComponent } from './vendor/insight/insight-customer/insight-customer-suborder/insight-customer-suborder.component';
import { InsightCustomerOrderComponent } from './vendor/insight/insight-customer/insight-customer-order/insight-customer-order.component';
import { TrackingDetailsComponent } from '../common/tracking-details/tracking-details.component';
import { ProjectSettingsComponent } from './vendor/projects/project-settings/project-settings.component';

import { ViewAllNotificationComponent } from '../common/view-all-notification/view-all-notification.component';
import { NotificationWidgetComponent } from '../common/notification-widget/notification-widget.component';
// import { NotificationSettingComponent } from './setting/notification-setting/notification-setting.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { SettingsContainerComponent } from './vendor/settings/settings-container/settings-container.component';
import { UpdatePasswordComponent } from './vendor/settings/update-password/update-password.component';
import { NotificationSettingComponent } from './vendor/settings/notification-setting/notification-setting.component';
import { ProdexProjectComponent } from './vendor/projects/prodex-project/prodex-project.component';
import { ProdexConnectComponent } from './vendor/projects/prodex-connect/prodex-connect.component';
import { ConnectSettingComponent } from './vendor/projects/connect-setting/connect-setting.component';
import { AddVendorContainerComponent } from './admin/add-vendor/add-vendor-container/add-vendor-container.component';
import { AddVendorUserComponent } from './admin/add-vendor/add-vendor-user/add-vendor-user.component';
import { AddCustomerContainerComponent } from './admin/add-customer/add-customer-container/add-customer-container.component';
import { AddCustomerUserComponent } from './admin/add-customer/add-customer-user/add-customer-user.component';
import { AddCustomerCompanyComponent } from './admin/add-customer/add-customer-company/add-customer-company.component';
import { AddVendorDetailComponent } from './admin/add-vendor/add-vendor-detail/add-vendor-detail.component';
import { AddVendorMachineComponent } from './admin/add-vendor/add-vendor-machine/add-vendor-machine.component';
import { ChipComponent } from '../common/chip/chip.component';
import { ConnectOrderDetailsComponent } from './vendor/projects/connect-order-details/connect-order-details.component';
import { PartListComponent } from '../common/part-list/part-list.component';
import { RefFileComponent } from '../common/ref-file/ref-file.component';
import { InsightPartInformationComponent } from './vendor/insight/insight-part-information/insight-part-information.component';
import { LinkCellRendererComponent } from '../common/link-cell-renderer/link-cell-renderer.component';
@NgModule({
  declarations: [
    ActionBarComponent,
    ActionCellApproveRendererComponent,
    ActionCellRendererComponent,
    ColumnSearchFilterComponent,
    CheckBoxComponent,
    DropdownCellRendererComponent,
    DropdownHeaderRendererComponent,
    MultiSelectCellEditorComponent,
    MultiSelectCellRendererComponent,
    LinkCellRendererComponent,
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
    SearchBarComponent,
    DateRangeMonthComponent,
    MultiPartsInformationComponent,

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
    DigitOnlyDirective,
    ProcessProfileComponent,
    ProcessProfileDetailComponent,
    BillingContainerComponent,
    PaymentContainerComponent,
    WaitingForApprovalComponent,
    PurchaseOrderItemComponent,
    PartItemDetailsComponent,
    WaitingForApprovalComponent,

    HistoricalBidComponent,
    ProjectsContainerComponent,
    OrderDetailComponent,
    CustomersComponent,
    CustomerViewComponent,
    PasswordComponent,
    ShippingComponent,
    ContactComponent,
    ProjectsListComponent,
    SendMailModalComponent,
    VendorOrderStatusComponent,
    SubscriptionModalComponent,

    InsightContainerComponent,
    InsightHeaderComponent,
    InsightGridComponent,
    InsightCustomersComponent,
    InsightVendorsComponent,
    InsightFacilityComponent,
    InsightRfqComponent,
    InsightPartComponent,
    InsightProcessProfileComponent,
    InsightPricingProfileComponent,
    ViewInThreeDComponent,
    // Pipes
    ConfirmOrderFilterPipe,
    SupplierPipe,
    InsightDetailComponent,
    ProductionOrdersContainerComponent,
    ProductionReleasedOrdersComponent,
    ProductionVendorDetailsComponent,
    BillingChatComponent,
    InsightVendorContainerComponent,
    InsightCustomerContainerComponent,
    InsightAdminContainerComponent,
    InsightQuoteComponent,
    InsightBidorderComponent,
    InsightBidorderitemComponent,
    InsightBidprocessComponent,
    InsightVendorOrderComponent,
    InsightVendorSuborderComponent,
    InsightCustomerSuborderComponent,
    InsightCustomerOrderComponent,
    TrackingDetailsComponent,
    ProjectSettingsComponent,
    ViewAllNotificationComponent,
    NotificationWidgetComponent,
    SettingsContainerComponent,
    UpdatePasswordComponent,
    NotificationSettingComponent,
    ProdexProjectComponent,
    ProdexConnectComponent,
    ConnectSettingComponent,
    ChipComponent,
    ConnectOrderDetailsComponent,
    PartListComponent,
    RefFileComponent,
    AddVendorContainerComponent,
    AddVendorUserComponent,
    AddCustomerContainerComponent,
    AddCustomerUserComponent,
    AddCustomerCompanyComponent,
    AddVendorDetailComponent,
    AddVendorMachineComponent,
    ChipComponent,
    InsightPartInformationComponent
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
      FileViewRendererComponent,
      LinkCellRendererComponent
    ]),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule,
    InternationalPhoneNumberModule,

    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ChatModule,
    UiSwitchModule
  ],
  providers: [DatePipe, CurrencyPipe],
  exports: [
    NgxSpinnerModule,
    AgGridModule,

    ActionBarComponent,
    ActionCellRendererComponent,
    ColumnSearchFilterComponent,
    CheckBoxComponent,
    MultiSelectCellRendererComponent,
    LinkCellRendererComponent,
    ProgressBarComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    ImgPreloadDirective,
    DigitOnlyDirective,

    // pipes
    ConfirmOrderFilterPipe,
    SupplierPipe
  ]
})
export class ComponentsModule {}
