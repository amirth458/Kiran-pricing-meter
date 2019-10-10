import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionBarComponent } from '../common/action-bar/action-bar.component';
import { ActionCellRendererComponent } from '../common/action-cell-renderer/action-cell-renderer.component';
import { ActionCellApproveRendererComponent } from '../common/action-cell-approve-renderer/action-cell-approve-renderer.component';
import { CarrierCellRendererComponent } from '../common/carrier-cell-renderer/carrier-cell-renderer.component';
import { ColumnSearchFilterComponent } from '../common/column-search-filter/column-search-filter.component';

import { ProfileContainerComponent } from './authorized/approved/_container/container.component';
import { ProfileVendorContainerComponent } from './authorized/approved/vendor/_container/container.component';
import { BasicDetailsComponent } from './authorized/approved/vendor/basic-details/basic-details.component';
import { FacilityComponent } from './authorized/approved/vendor/facility/facility.component';
import { FacilityItemComponent } from './authorized/approved/vendor/facility-item/facility-item.component';
import { MachinesComponent } from './authorized/approved/vendor/machines/machines.component';
import { MachineItemComponent } from './authorized/approved/vendor/machine-item/machine-item.component';
import { PreferencesComponent } from './authorized/approved/vendor/preferences/preferences.component';
import { ShippingComponent } from './authorized/approved/vendor/shipping/shipping.component';
import { ShippingItemComponent } from './authorized/approved/vendor/shipping-item/shipping-item.component';

import { UnapprovedVendorContainerComponent } from './authorized/unapproved/_container/container.component';
import { UnapprovedVendorUserComponent } from './authorized/unapproved/user/user.component';
import { UnapprovedVendorMachineComponent } from './authorized/unapproved/machine/machine.component';
import { UnapprovedVendorDetailsComponent } from './authorized/unapproved/vendor/vendor.component';
import { UnapprovedVendorActionBarComponent } from './authorized/unapproved/action-bar/action-bar.component';

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
import { SideMenuComponent } from '../common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from '../common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from '../common/top-menu/top-menu.component';

import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';

import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { AdminContainerComponent } from './admin/_container/container.component';
import { DropdownCellRendererComponent } from '../common/dropdown-cell-renderer/dropdown-cell-renderer.component';
import { ApproveVendorComponent } from './admin/approve-vendor/approve-vendor.component';
import { AdminVendorDetailsContainerComponent } from './admin/vendor-details/_container/container.component';
import { AdminVendorDetailsActionBarComponent } from './admin/vendor-details/action-bar/action-bar.component';
import { AdminVendorDetailsUserComponent } from './admin/vendor-details/user/user.component';
import { AdminVendorDetailsVendorComponent } from './admin/vendor-details/vendor/vendor.component';
import { AdminVendorDetailsMachineComponent } from './admin/vendor-details/machine/machine.component';

@NgModule({
  declarations: [
    ActionBarComponent,
    ActionCellRendererComponent,
    DropdownCellRendererComponent,
    ActionCellApproveRendererComponent,
    CarrierCellRendererComponent,
    ColumnSearchFilterComponent,

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

    ProfileContainerComponent,
    ProfileVendorContainerComponent,
    BasicDetailsComponent,
    ShippingComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    ShippingItemComponent,
    FacilityComponent,
    FacilityItemComponent,
    MachinesComponent,
    MachineItemComponent,
    PreferencesComponent,

    UnapprovedVendorContainerComponent,
    UnapprovedVendorUserComponent,
    UnapprovedVendorMachineComponent,
    UnapprovedVendorDetailsComponent,
    UnapprovedVendorActionBarComponent,

    AdminContainerComponent,
    ApproveVendorComponent,
    AdminVendorDetailsContainerComponent,
    AdminVendorDetailsActionBarComponent,
    AdminVendorDetailsUserComponent,
    AdminVendorDetailsVendorComponent,
    AdminVendorDetailsMachineComponent
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      ActionCellRendererComponent,
      CarrierCellRendererComponent,
      DropdownCellRendererComponent,
      ActionCellApproveRendererComponent,
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
    ActionCellApproveRendererComponent,
    CarrierCellRendererComponent,
    ColumnSearchFilterComponent,

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

    ProfileContainerComponent,
    ProfileVendorContainerComponent,
    BasicDetailsComponent,
    ShippingComponent,
    ShippingItemComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    FacilityComponent,
    FacilityItemComponent,
    MachinesComponent,
    MachineItemComponent,
    PreferencesComponent,

    UnapprovedVendorContainerComponent,
    UnapprovedVendorUserComponent,
    UnapprovedVendorMachineComponent,
    UnapprovedVendorDetailsComponent,
    UnapprovedVendorActionBarComponent,

    AdminContainerComponent,
    ApproveVendorComponent,
    AdminVendorDetailsContainerComponent,
    AdminVendorDetailsActionBarComponent,
    AdminVendorDetailsUserComponent,
    AdminVendorDetailsVendorComponent,
    AdminVendorDetailsMachineComponent
  ]
})
export class ComponentsModule { }
