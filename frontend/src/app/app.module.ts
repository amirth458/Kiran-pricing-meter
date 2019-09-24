import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { FooterMenuComponent } from './common/footer-menu/footer-menu.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule
    // ApiModule.forRoot({ rootUrl: 'localhost:4000' }),
  ],
  declarations: [
    LoginComponent,
    AppComponent,
    FooterMenuComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
