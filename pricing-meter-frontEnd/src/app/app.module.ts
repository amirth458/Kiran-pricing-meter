import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterStepOneComponent } from './Component/agent/register-step-one/register-step-one.component';
import { RegisterStepTwoComponent } from './Component/agent/register-step-two/register-step-two.component';
import { RegisterStepThreeComponent } from './Component/agent/register-step-three/register-step-three.component';
import { RegisterStepFourComponent } from './Component/agent/register-step-four/register-step-four.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterStepOneComponent,
    RegisterStepTwoComponent,
    RegisterStepThreeComponent,
    RegisterStepFourComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
