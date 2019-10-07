import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard as AuthGuard } from './guard/logged-in.guard';
import { LoginComponent } from './components/login/login.component';
import { UnapprovedComponent } from './components/unapproved/unapproved.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterVendorComponent } from './components/register-vendor/register-vendor.component';
import { RegisterMachineComponent } from './components/register-machine/register-machine.component';

const routes: Routes = [
  // { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: '',
    loadChildren: './layouts/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'unapproved', component: UnapprovedComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'vendor-register', component: RegisterVendorComponent },
      { path: 'machine-register', component: RegisterMachineComponent },
    ]
  },
  { path: '**',  pathMatch: 'full', redirectTo: 'profile',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
