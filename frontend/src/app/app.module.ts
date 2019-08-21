import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { SideMenuComponent } from './common/side-menu/side-menu.component';
import { TopMenuComponent } from './common/top-menu/top-menu.component';

// Services
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';


@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
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
