import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from '../../components/profile/profile.component';
import { VendorComponent } from '../../components/vendor/vendor.component';
import { BasicDetailsComponent } from '../../components/basic-details/basic-details.component';
import { FacilityComponent } from '../../components/facility/facility.component';
import { FacilityItemComponent } from '../../components/facility-item/facility-item.component';
import { MachinesComponent } from '../../components/machines/machines.component';
import { MachineItemComponent } from '../../components/machine-item/machine-item.component';
import { PreferencesComponent } from '../../components/preferences/preferences.component';
import { ShippingComponent } from '../../components/shipping/shipping.component';
import { ShippingItemComponent } from '../../components/shipping-item/shipping-item.component';
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
import { AdminComponent } from 'src/app/components/admin/container/admin.component';
import { ApproveVendorComponent } from 'src/app/components/admin/approve-vendor/approve-vendor.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile', component: ProfileComponent,
        children: [
          {
            path: 'vendor', component: VendorComponent,
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
        path: 'admin', component: AdminComponent,
        children: [
          {
            path: 'approve-vendor', component: ApproveVendorComponent,
            children: [
              { path: ':vendorId', component: BasicDetailsComponent },
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
