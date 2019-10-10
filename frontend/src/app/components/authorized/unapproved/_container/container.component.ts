import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { AppFields, Store } from 'src/app/store';

@Component({
  selector: 'app-unapproved-vendor-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class UnapprovedVendorContainerComponent implements OnInit {
  registerMenu = {
    name: 'User Details',
    tooltipMessage: 'User Details.',
    route: 'user',
  };
  vendorMenu = {
    name: 'Vendor Details',
    tooltipMessage: 'Vendor Details.',
    route: 'vendor',
  };
  machineMenu = {
    name: 'Machine Details',
    tooltipMessage: 'Machine Details.',
    route: 'machine',
  };
  actionbarMenu = [];
  selectedTab = 'User Details';

  vendor: Observable<any>;
  sub: Subscription;

  constructor(
    private route: Router,
    private store: Store<any>
  ) {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const routeArr = this.route.url.slice(this.route.url.indexOf('profile/unapproved/') + 'profile/unapproved/'.length).split('/');
      switch (routeArr[0]) {
        case 'user':
          this.selectedTab = 'User Details';
          break;
        case 'vendor':
          this.selectedTab = 'Vendor Details';
          break;
        case 'machine':
          this.selectedTab = 'Machine Details';
          break;
        default:
          this.selectedTab = 'User Details';
          break;
      }
    });

    this.vendor = this.store.select(AppFields.App, AppFields.VendorInfo);
  }

  ngOnInit() {
    const routeArr = this.route.url.slice(this.route.url.indexOf('profile/unapproved/') + 'profile/unapproved/'.length).split('/');
    switch (routeArr[0]) {
      case 'user':
        this.selectedTab = 'User Details';
        break;
      case 'vendor':
        this.selectedTab = 'Vendor Details';
        break;
      case 'machine':
        this.selectedTab = 'Machine Details';
        break;
      default:
        this.selectedTab = 'User Details';
        break;
    }

    this.actionbarMenu = [this.registerMenu, this.vendorMenu, this.machineMenu];
    this.sub = this.vendor.subscribe(res => {
      if (res && res.approved) {
        this.route.navigateByUrl('/profile/vendor');
      }
    });
  }
}
