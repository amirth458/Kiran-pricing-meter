import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { BasicDetailsComponent } from './component/basic-details/basic-details.component';
import { FacilityComponent } from './component/facility/facility.component';
import { FacilityItemComponent } from './component/facility-item/facility-item.component';
import { MachinesComponent } from './components/machines/machines.component';
import { MachineItemComponent } from './components/machine-item/machine-item.component';
import { PreferencesComponent } from './component/preferences/preferences.component';
import { ProfileComponent } from './component/profile/profile.component';
import { VendorComponent } from './components/vendor/vendor.component';

const routes: Routes = [

  {
    path: 'profile', component: ProfileComponent,
    children: [
      {
        path: 'vendor', component: VendorComponent,
        children: [
          { path: 'basics', component: BasicDetailsComponent },
          { path: 'facilities', component: FacilityComponent },
          { path: 'facilities/add', component: FacilityItemComponent },
          { path: 'facilities/edit/:id', component: FacilityItemComponent },
          { path: 'machines', component: MachinesComponent },
          { path: 'machines/add', component: MachineItemComponent },
          { path: 'machines/edit/:id', component: MachineItemComponent },
          { path: 'preferences', component: PreferencesComponent },
          { path: '', pathMatch: 'full', redirectTo: 'basics' },
          { path: '**', pathMatch: 'full', redirectTo: 'basics' }
        ]
      },
      { path: '', pathMatch: 'full', redirectTo: 'vendor' },
      { path: '**', pathMatch: 'full', redirectTo: 'vendor' }
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'profile' },
  { path: '**', pathMatch: 'full', redirectTo: 'profile' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
