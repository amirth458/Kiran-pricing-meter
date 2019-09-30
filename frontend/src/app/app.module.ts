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

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    // ApiModule.forRoot({ rootUrl: 'localhost:4000' }),

    StoreModule.forRoot({ app: appReducer }),
    EffectsModule.forRoot([ AppEffects ])
  ],
  declarations: [
    LoginComponent,
    AppComponent,
    FooterMenuComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
