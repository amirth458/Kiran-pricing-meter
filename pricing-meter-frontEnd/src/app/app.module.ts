import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterStepOneComponent } from './Component/agent/register-step-one/register-step-one.component';
import { RegisterStepTwoComponent } from './Component/agent/register-step-two/register-step-two.component';
import { RegisterStepThreeComponent } from './Component/agent/register-step-three/register-step-three.component';
import { RegisterStepFourComponent } from './Component/agent/register-step-four/register-step-four.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterStepFiveComponent } from './Component/agent/register-step-five/register-step-five.component';
import { LoginComponent } from './Component/agent/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterStepOneComponent,
    RegisterStepTwoComponent,
    RegisterStepThreeComponent,
    RegisterStepFourComponent,
    RegisterStepFiveComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
