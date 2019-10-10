import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard as AuthGuard } from './guard/logged-in.guard';

import { LoginComponent } from './components/login/login.component';

import { RegisterContainerComponent } from './components/signup/_container/container.component';
import { RegisterUserComponent } from './components/signup/user/user.component';
import { RegisterVendorComponent } from './components/signup/vendor/vendor.component';
import { RegisterMachineComponent } from './components/signup/machine/machine.component';
import { RegisterCompletedComponent } from './components/signup-completed/completed.component';

const routes: Routes = [
  // { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: '',
    loadChildren: './layouts/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'signup', component: RegisterContainerComponent,
    children: [
      { path: 'user', component: RegisterUserComponent },
      { path: 'vendor', component: RegisterVendorComponent },
      { path: 'machine', component: RegisterMachineComponent },
    ]
  },
  { path: 'signup-completed', component: RegisterCompletedComponent },
  { path: '**',  pathMatch: 'full', redirectTo: 'profile',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
