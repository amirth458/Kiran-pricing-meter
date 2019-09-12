import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';

// Components
import { ActionBarComponent } from './common/action-bar/action-bar.component';
import { ActionCellRendererComponent } from './common/action-cell-renderer/action-cell-renderer.component';
import { AppComponent } from './app.component';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';
import { CarrierCellRendererComponent } from './common/carrier-cell-renderer/carrier-cell-renderer.component';
import { ColumnSearchFilterComponent } from './common/column-search-filter/column-search-filter.component';
import { FacilityComponent } from './components/facility/facility.component';
import { FacilityItemComponent } from './components/facility-item/facility-item.component';
import { MachinesComponent } from './components/machines/machines.component';
import { MachineItemComponent } from './components/machine-item/machine-item.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { ProcessComponent } from './components/process/process.component';
import { PostProcessComponent } from './components/post-process/post-process.component';
import { PostProcessPricingComponent } from './components/post-process-pricing/post-process-pricing.component';
import { PostProcessProfileComponent } from './components/post-process-profile/post-process-profile.component';
import { PostProcessPricingItemComponent } from './components/post-process-pricing-item/post-process-pricing-item.component';
import { PostProcessProfileItemComponent } from './components/post-process-profile-item/post-process-profile-item.component';
import { ProcessPricingComponent } from './components/process-pricing/process-pricing.component';
import { ProcessPricingItemComponent } from './components/process-pricing-item/process-pricing-item.component';
import { ProcessProfileComponent } from './components/process-profile/process-profile.component';
import { ProcessProfileItemComponent } from './components/process-profile-item/process-profile-item.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ShippingComponent } from './components/shipping/shipping.component';
import { ShippingItemComponent } from './components/shipping-item/shipping-item.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from './common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from './common/top-menu/top-menu.component';
import { VendorComponent } from './components/vendor/vendor.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([
      ActionCellRendererComponent,
      CarrierCellRendererComponent
    ]),
    // ApiModule.forRoot({ rootUrl: 'localhost:4000' }),
  ],
  declarations: [
    ActionBarComponent,
    ActionCellRendererComponent,
    AppComponent,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
