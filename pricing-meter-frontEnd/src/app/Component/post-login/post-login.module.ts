import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLoginRoutingModule } from './post-login-routing.module';
import { AddPropertyComponent } from './add-property/add-property.component';
import { PropertyListComponent } from './property-list/property-list.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import { UploadPropertyComponent } from './add-property/upload-property/upload-property.component';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from '@angular/material/select';
import { UploadCsvComponent } from './add-property/upload-csv/upload-csv.component';
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from '@angular/material/menu';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { AddTeamMembersComponent } from './add-team-members/add-team-members.component';
import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';
import { HelpComponent } from './help/help.component';
import {GaugesModule} from '@biacsics/ng-canvas-gauges';
import { PropertyDetailsComponent } from './property-list/property-details/property-details.component';
import {BrowserModule} from '@angular/platform-browser';
import {MatButtonModule} from "@angular/material/button";
import { PricingMeterDemoComponent } from './property-list/pricing-meter-demo/pricing-meter-demo.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgSelectModule } from '@ng-select/ng-select'

@NgModule({
  declarations: [
    AddPropertyComponent,
    PropertyListComponent,
    UploadPropertyComponent,
    UploadCsvComponent,
    AccountSettingComponent,
    AddTeamMembersComponent,
    EditSubscriptionComponent,
    HelpComponent,
    PropertyDetailsComponent,
    PricingMeterDemoComponent
  ],
    imports: [
        CommonModule,
        PostLoginRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatSelectModule,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        BrowserModule,
        GaugesModule,
        MatButtonModule,
        NgSelectModule
    ],
  exports: [
    MatMenuModule,
    MatAutocompleteModule
  ]
})
export class PostLoginModule { }
