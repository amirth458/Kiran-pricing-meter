import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterStepOneComponent} from "./Component/agent/register-step-one/register-step-one.component";
import {RegisterStepTwoComponent} from "./Component/agent/register-step-two/register-step-two.component";
import {RegisterStepThreeComponent} from "./Component/agent/register-step-three/register-step-three.component";
import {RegisterStepFourComponent} from "./Component/agent/register-step-four/register-step-four.component";
import {RegisterStepFiveComponent} from "./Component/agent/register-step-five/register-step-five.component";
import {LoginComponent} from "./Component/agent/login/login.component";
import {PricingComponent} from "./Component/agent/pricing/pricing.component";
import {AboutComponent} from "./Component/agent/about/about.component";
import {FeaturesComponent} from "./Component/agent/features/features.component";
import {ForgetPasswordComponent} from "./Component/agent/forget-password/forget-password.component"


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'features',
    component: FeaturesComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'agent',
    // canActivate: [AuthGaurd],
    children: [
      {
        path: 'register-step-one',
        component: RegisterStepOneComponent
      },
      {
        path: 'register-step-two',
        component: RegisterStepTwoComponent
      },
      {
        path: 'register-step-three',
        component: RegisterStepThreeComponent
      },
      {
        path: 'register-step-four',
        component: RegisterStepFourComponent
      },
      {
        path: 'register-step-five',
        component: RegisterStepFiveComponent
      },
    ]
  }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
