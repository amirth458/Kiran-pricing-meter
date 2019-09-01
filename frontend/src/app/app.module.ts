import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';

// Components
import { ActionBarComponent } from './common/action-bar/action-bar.component';
import { AppComponent } from './app.component';
import { BasicDetailsComponent } from './component/basic-details/basic-details.component';
import { ColumnSearchFilterComponent } from './common/column-search-filter/column-search-filter.component';
import { FacilityItemComponent } from './component/facility-item/facility-item.component';
import { PreferencesComponent } from './component/preferences/preferences.component';
import { ProfileComponent } from './component/profile/profile.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from './common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from './common/top-menu/top-menu.component';

// Services
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';


@NgModule({
  declarations: [
    ActionBarComponent,
    AppComponent,
    BasicDetailsComponent,
    ColumnSearchFilterComponent,
    FacilityItemComponent,
    PreferencesComponent,
    ProfileComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
  ],
  imports: [
    AppRoutingModule,
    AgGridModule.withComponents([]),
    BrowserModule,
    FormsModule
  ],
  providers: [
    AuthService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
