import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterStepOneComponent} from "./Component/agent/register-step-one/register-step-one.component";
import {RegisterStepTwoComponent} from "./Component/agent/register-step-two/register-step-two.component";
import {RegisterStepThreeComponent} from "./Component/agent/register-step-three/register-step-three.component";
import {RegisterStepFourComponent} from "./Component/agent/register-step-four/register-step-four.component";


const routes: Routes = [
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
      }
    ]
  }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
