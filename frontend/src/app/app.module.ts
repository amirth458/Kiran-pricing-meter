import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { ActionBarComponent } from './common/action-bar/action-bar.component';
import { ColumnSearchFilterComponent } from './common/column-search-filter/column-search-filter.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from './common/sub-section-menu/sub-section-menu.component';
import { ProfileComponent } from './component/profile/profile.component';
import { TopMenuComponent } from './common/top-menu/top-menu.component';

// Services
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';


@NgModule({
  declarations: [
    AppComponent,
    ActionBarComponent,
    ColumnSearchFilterComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    ProfileComponent,
    TopMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
