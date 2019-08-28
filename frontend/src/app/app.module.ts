import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { ColumnSearchFilterComponent } from './common/column-search-filter/column-search-filter.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { SubSectionMenuComponent } from './common/sub-section-menu/sub-section-menu.component';
import { TopMenuComponent } from './common/top-menu/top-menu.component';

// Services
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { ActionBarComponent } from './common/action-bar/action-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    ColumnSearchFilterComponent,
    SideMenuComponent,
    SubSectionMenuComponent,
    TopMenuComponent,
    ActionBarComponent
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
