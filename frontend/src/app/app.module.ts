import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { FooterMenuComponent } from './common/footer-menu/footer-menu.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';
import { RegisterContainerComponent } from './components/signup/_container/container.component';
import { RegisterUserComponent } from './components/signup/user/user.component';
import { RegisterActionBarComponent } from './common/register-action-bar/register-action-bar.component';
import { RegisterVendorComponent } from './components/signup/vendor/vendor.component';
import { RegisterMachineComponent } from './components/signup/machine/machine.component';
import { RegisterCompletedComponent } from './components/signup/completed/completed.component';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { ComponentsModule } from './components/components.module';
import { AuthInterceptor } from './http-interceptors/auth-inteceptor';
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
    // ApiModule.forRoot({ rootUrl: 'localhost:4000' }),
    InternationalPhoneNumberModule,
    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([AppEffects]),
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
    ComponentsModule,
  ],
  declarations: [
    LoginComponent,
    RegisterContainerComponent,
    AppComponent,
    FooterMenuComponent,
    RegisterActionBarComponent,
    RegisterUserComponent,
    RegisterVendorComponent,
    RegisterMachineComponent,
    RegisterCompletedComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
