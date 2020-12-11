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
import { LoginDialogComponent } from './Component/agent/login-dialog/login-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { LayoutComponent } from './layout/layout/layout.component';
import {NgxUiLoaderModule} from "ngx-ui-loader";
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import {PostLoginModule} from "./Component/post-login/post-login.module";
import { CommonDialogBoxComponent } from './Shared/common-dialog-box/common-dialog-box.component';
import {MatButtonModule} from "@angular/material/button";
import { FooterComponent } from './layout/footer/footer.component';
import { PricingComponent } from './Component/agent/pricing/pricing.component';
import { PreHeaderComponent } from './layout/pre-header/pre-header.component';
import { FeaturesComponent } from './Component/agent/features/features.component';
import { AboutComponent } from './Component/agent/about/about.component';



@NgModule({
    declarations: [
        AppComponent,
        RegisterStepOneComponent,
        RegisterStepTwoComponent,
        RegisterStepThreeComponent,
        RegisterStepFourComponent,
        RegisterStepFiveComponent,
        LoginComponent,
        LoginDialogComponent,
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        CommonDialogBoxComponent,
        FooterComponent,
        PricingComponent,
        PreHeaderComponent,
        FeaturesComponent,
        AboutComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        MatSidenavModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        NgxUiLoaderModule,
        PostLoginModule,
        MatButtonModule,
    ],
    providers: [],
    exports: [
        FooterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
