import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../common/action-bar/action-bar.component';
import { ActionCellRendererComponent } from '../common/action-cell-renderer/action-cell-renderer.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { CarrierCellRendererComponent } from '../common/carrier-cell-renderer/carrier-cell-renderer.component';
import { ColumnSearchFilterComponent } from '../common/column-search-filter/column-search-filter.component';
import { FacilityComponent } from './facility/facility.component';
import { FacilityItemComponent } from './facility-item/facility-item.component';
import { MachinesComponent } from './machines/machines.component';
import { MachineItemComponent } from './machine-item/machine-item.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PostProcessComponent } from './post-process/post-process.component';
import { PostProcessPricingComponent } from './post-process-pricing/post-process-pricing.component';
import { PostProcessPricingItemComponent } from './post-process-pricing-item/post-process-pricing-item.component';
import { PostProcessProfileComponent } from './post-process-profile/post-process-profile.component';
import { PostProcessProfileItemComponent } from './post-process-profile-item/post-process-profile-item.component';
import { ProcessComponent } from './process/process.component';
import { ProcessPricingComponent } from './process-pricing/process-pricing.component';
import { ProcessPricingItemComponent } from './process-pricing-item/process-pricing-item.component';
import { ProcessProfileComponent } from './process-profile/process-profile.component';
import { ProcessProfileItemComponent } from './process-profile-item/process-profile-item.component';
import { ProfileComponent } from './profile/profile.component';
import { ShippingComponent } from './shipping/shipping.component';
import { SideMenuComponent } from '../common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from '../common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from '../common/top-menu/top-menu.component';
import { VendorComponent } from './vendor/vendor.component';
import { ShippingItemComponent } from './shipping-item/shipping-item.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';

import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { AdminComponent } from './admin/container/admin.component';
import { ApproveVendorComponent } from './admin/approve-vendor/approve-vendor.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    ActionCellRendererComponent,
    BasicDetailsComponent,
    CarrierCellRendererComponent,
    ColumnSearchFilterComponent,
    FacilityComponent,
    FacilityItemComponent,
    MachinesComponent,
    MachineItemComponent,
    PreferencesComponent,
    PostProcessComponent,
    PostProcessPricingComponent,
    PostProcessPricingItemComponent,
    PostProcessProfileComponent,
    PostProcessProfileItemComponent,
    ProcessComponent,
    ProcessPricingComponent,
    ProcessPricingItemComponent,
    ProcessProfileComponent,
    ProcessProfileItemComponent,
    ProfileComponent,
    ShippingComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    VendorComponent,
    ShippingItemComponent,
    AdminComponent,
    ApproveVendorComponent,

  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      ActionCellRendererComponent,
      CarrierCellRendererComponent
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
    ActionBarComponent,
    AgGridModule,
    ActionCellRendererComponent,
    BasicDetailsComponent,
    CarrierCellRendererComponent,
    ColumnSearchFilterComponent,
    FacilityComponent,
    FacilityItemComponent,
    MachinesComponent,
    MachineItemComponent,
    PreferencesComponent,
    PostProcessComponent,
    PostProcessPricingComponent,
    PostProcessPricingItemComponent,
    PostProcessProfileComponent,
    PostProcessProfileItemComponent,
    ProcessComponent,
    ProcessPricingComponent,
    ProcessPricingItemComponent,
    ProcessProfileComponent,
    ProcessProfileItemComponent,
    ProfileComponent,
    ShippingComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    VendorComponent,
    ShippingItemComponent,
    AdminComponent,
    ApproveVendorComponent,
  ]
})
export class ComponentsModule { }
