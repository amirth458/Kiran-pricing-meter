import { ModelDetailViewComponent } from './../common/model-detail-view/model-detail-view.component';
import { FileViewRendererComponent } from './../common/file-view-renderer/file-view-renderer.component';
import { AppModule } from './../app.module';
import { StatusDropdownFilterComponent } from './../common/status-dropdown-filter/status-dropdown-filter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule } from '@angular/router';

import { ActionBarComponent } from '../common/action-bar/action-bar.component';
import { ActionCellRendererComponent } from '../common/action-cell-renderer/action-cell-renderer.component';
import { ColumnSearchFilterComponent } from '../common/column-search-filter/column-search-filter.component';
import { DropdownCellRendererComponent } from '../common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { DropdownHeaderRendererComponent } from '../common/dropdown-header-renderer/dropdown-header-renderer.component';
import { MultiSelectCellEditorComponent } from '../common/multi-select-cell-editor/multi-select-cell-editor.component';
import { MultiSelectCellRendererComponent } from '../common/multi-select-cell-renderer/multi-select-cell-renderer.component'
import { SideMenuComponent } from '../common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from '../common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from '../common/top-menu/top-menu.component';
import { ProgressBarComponent } from '../common/progress-bar/progress-bar.component';

import { MarketplaceContainerComponent } from './vendor/marketplace/marketplace-container/marketplace-container.component';
import { ReferralContainerComponent } from './vendor/marketplace/referral/referral-container/referral-container.component';
import { ReferralComponent } from './vendor/marketplace/referral/referral/referral.component';
import { ReferralDetailsComponent } from './vendor/marketplace/referral/referral-details/referral-details.component';
import { PricingContainerComponent } from './vendor/pricing/pricing-container/pricing-container.component';
import { RfqContainerComponent } from './vendor/pricing/rfq/rfq-container/rfq-container.component';
import { PricingSettingsComponent } from './vendor/pricing/rfq/pricing-settings/pricing-settings.component';
import { RecentAutoPricesComponent } from './vendor/pricing/rfq/recent-auto-prices/recent-auto-prices.component';
import { QueuedManualPriceComponent } from './vendor/pricing/rfq/queued-manual-price/queued-manual-price.component';

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
@NgModule({
  declarations: [
    ActionBarComponent,
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
    
  ],
  imports: [
    CommonModule,
    NgbModule,
    AgGridModule.withComponents([
      ActionCellRendererComponent,
      DropdownCellRendererComponent,
      DropdownHeaderRendererComponent,
      MultiSelectCellRendererComponent,
      MultiSelectCellEditorComponent,
      StatusDropdownFilterComponent,
      TemplateRendererComponent,
      FileViewRendererComponent,
    ]),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule,
    InternationalPhoneNumberModule,
  ],
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
  ]
})
export class ComponentsModule { }
