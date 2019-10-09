import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { Observable, Subscription } from 'rxjs';
import { Vendor } from 'src/app/model/vendor.model';
import { Store } from '@ngrx/store';
import { AppFields } from 'src/app/store';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  baseURL = '';

  submenus = [];
  vendorMenus = [];
  additionalSubMenus = [];
  selectedSubmenu;
  sidemenuClosed;

  vendor: Observable<Vendor>;
  sub: Subscription;

  constructor(
    private route: Router,
    private authService: AuthService,
    private userService: UserService,
    private store: Store<any>
  ) {
    this.baseURL = this.route.url.split('/')[1];
    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  ngOnInit() {
    this.vendorMenus = [
      {
        name: 'Vendor',
        route: this.baseURL + '/vendor'
      }
    ];

    this.additionalSubMenus = [
      {
        name: 'Processes',
        route: this.baseURL + '/processes'
      },
      {
        name: 'Post-Processes',
        route: this.baseURL + '/post-processes'
      }
    ];

    this.selectedSubmenu = this.baseURL + '/vendor';
  }

  ngOnDestroy() {

  }
}
