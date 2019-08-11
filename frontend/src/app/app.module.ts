import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "angular2-cookie/services/cookies.service";

import { AppComponent } from './app.component';

import { AUTH_PROVIDERS } from './service/auth.service';
import { LoggedInGuard } from './logged-in.guard';
import {CarouselModule, ModalModule} from "ngx-bootstrap";


import { ChartsModule } from 'ng2-charts';


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full'},
];



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes, {useHash: true}),
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    ChartsModule,
    HttpClientModule
  ],
  providers: [AUTH_PROVIDERS, LoggedInGuard, CookieService],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
