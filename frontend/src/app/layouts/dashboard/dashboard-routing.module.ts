import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileContainerComponent } from '../../components/authorized/approved/_container/container.component';
import { ProfileVendorContainerComponent } from '../../components/authorized/approved/vendor/_container/container.component';
import { BasicDetailsComponent } from '../../components/authorized/approved/vendor/basic-details/basic-details.component';
import { FacilityComponent } from '../../components/authorized/approved/vendor/facility/facility.component';
import { FacilityItemComponent } from '../../components/authorized/approved/vendor/facility-item/facility-item.component';
import { MachinesComponent } from '../../components/authorized/approved/vendor/machines/machines.component';
import { MachineItemComponent } from '../../components/authorized/approved/vendor/machine-item/machine-item.component';
import { PreferencesComponent } from '../../components/authorized/approved/vendor/preferences/preferences.component';
import { ShippingComponent } from '../../components/authorized/approved/vendor/shipping/shipping.component';
import { ShippingItemComponent } from '../../components/authorized/approved/vendor/shipping-item/shipping-item.component';
import { ProcessComponent } from '../../components/process/process.component';
import { ProcessProfileComponent } from '../../components/process-profile/process-profile.component';
import { ProcessProfileItemComponent } from '../../components/process-profile-item/process-profile-item.component';
import { ProcessPricingComponent } from '../../components/process-pricing/process-pricing.component';
import { ProcessPricingItemComponent } from '../../components/process-pricing-item/process-pricing-item.component';
import { PostProcessComponent } from '../../components/post-process/post-process.component';
import { PostProcessProfileComponent } from '../../components/post-process-profile/post-process-profile.component';
import { PostProcessProfileItemComponent } from '../../components/post-process-profile-item/post-process-profile-item.component';
import { PostProcessPricingComponent } from '../../components/post-process-pricing/post-process-pricing.component';
import { PostProcessPricingItemComponent } from '../../components/post-process-pricing-item/post-process-pricing-item.component';

import { UnapprovedVendorContainerComponent } from '../../components/authorized/unapproved/_container/container.component';
import { UnapprovedVendorUserComponent } from '../../components/authorized/unapproved/user/user.component';
import { UnapprovedVendorMachineComponent } from '../../components/authorized/unapproved/machine/machine.component';
import { UnapprovedVendorDetailsComponent } from '../../components/authorized/unapproved/vendor/vendor.component';

import { AdminContainerComponent } from '../../components/admin/_container/container.component';
import { ApproveVendorComponent } from '../../components/admin/approve-vendor/approve-vendor.component';
import { AdminVendorDetailsContainerComponent } from '../../components/admin/vendor-details/_container/container.component';
import { AdminVendorDetailsUserComponent } from '../../components/admin/vendor-details/user/user.component';
import { AdminVendorDetailsVendorComponent } from '../../components/admin/vendor-details/vendor/vendor.component';
import { AdminVendorDetailsMachineComponent } from '../../components/admin/vendor-details/machine/machine.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile', component: ProfileContainerComponent,
        children: [
          {
            path: 'vendor', component: ProfileVendorContainerComponent,
            children: [
              { path: 'basics', component: BasicDetailsComponent },
              { path: 'basics/:vendorId', component: BasicDetailsComponent },
              { path: 'facilities', component: FacilityComponent },
              { path: 'facilities/add', component: FacilityItemComponent },
              { path: 'facilities/edit/:id', component: FacilityItemComponent },
              { path: 'machines', component: MachinesComponent },
              { path: 'machines/add', component: MachineItemComponent },
              { path: 'machines/edit/:id', component: MachineItemComponent },
              { path: 'preferences', component: PreferencesComponent },
              { path: 'shipping', component: ShippingComponent },
              { path: 'shipping/add', component: ShippingItemComponent },
              { path: 'shipping/edit/:id', component: ShippingItemComponent },
              { path: '', pathMatch: 'full', redirectTo: 'basics' },
              { path: '**', pathMatch: 'full', redirectTo: 'basics' }
            ]
          },
          {
            path: 'unapproved', component: UnapprovedVendorContainerComponent,
            children: [
              { path: 'user', component: UnapprovedVendorUserComponent },
              { path: 'vendor', component: UnapprovedVendorDetailsComponent },
              { path: 'machine', component: UnapprovedVendorMachineComponent },
              { path: '', pathMatch: 'full', redirectTo: 'user' },
              { path: '**', pathMatch: 'full', redirectTo: 'user' }
            ]
          },
          {
            path: 'processes', component: ProcessComponent,
            children: [
              { path: 'profile', component: ProcessProfileComponent },
              { path: 'profile/add', component: ProcessProfileItemComponent },
              { path: 'profile/edit/:id', component: ProcessProfileItemComponent },
              { path: 'pricing', component: ProcessPricingComponent },
              { path: 'pricing/add', component: ProcessPricingItemComponent },
              { path: 'pricing/edit/:id', component: ProcessPricingItemComponent },
              { path: '', redirectTo: 'profile', pathMatch: 'full' },
              { path: '**', redirectTo: 'profile', pathMatch: 'full' }
            ]
          },
          {
            path: 'post-processes', component: PostProcessComponent,
            children: [
              { path: 'profile', component: PostProcessProfileComponent },
              { path: 'profile/add', component: PostProcessProfileItemComponent },
              { path: 'profile/edit/:id', component: PostProcessProfileItemComponent },
              { path: 'pricing', component: PostProcessPricingComponent },
              { path: 'pricing/add', component: PostProcessPricingItemComponent },
              { path: 'pricing/edit/:id', component: PostProcessPricingItemComponent },
              { path: '', redirectTo: 'profile', pathMatch: 'full' },
              { path: '**', redirectTo: 'profile', pathMatch: 'full' }
            ]
          },
          { path: '', redirectTo: 'vendor', pathMatch: 'full' },
          { path: '**', redirectTo: 'vendor', pathMatch: 'full' }
        ],
      },
      {
        path: 'admin', component: AdminContainerComponent,
        children: [
          {
            path: 'approve-vendor', component: ApproveVendorComponent,
          },
          {
            path: 'vendor-details/:vendorId', component: AdminVendorDetailsContainerComponent,
            children: [
              { path: 'user', component: AdminVendorDetailsUserComponent },
              { path: 'vendor', component: AdminVendorDetailsVendorComponent },
              { path: 'machine', component: AdminVendorDetailsMachineComponent },
            ]
          },
          { path: '', pathMatch: 'full', redirectTo: 'approve-vendor' },
          { path: '**', pathMatch: 'full', redirectTo: 'approve-vendor' }
        ]
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
