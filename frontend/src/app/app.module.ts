import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { FooterMenuComponent } from './common/footer-menu/footer-menu.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      closeButton: true,
      newestOnTop: false,
      progressBar: false,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 5000,
      extendedTimeOut: 1000,
      easing: 'ease-in',
    }),
  ],
  declarations: [
    LoginComponent,
    AppComponent,
    FooterMenuComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
