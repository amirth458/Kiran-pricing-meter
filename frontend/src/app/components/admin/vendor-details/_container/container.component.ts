import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import * as tooltipData from '../../../../../assets/tooltip.json';

@Component({
  selector: 'app-admin-vendor-details-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class AdminVendorDetailsContainerComponent implements OnInit {
  actionbarMenu = tooltipData.default.adminVendor;
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {
    this.route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const routeArr = this.route.url
          .slice(
            this.route.url.indexOf('admin/vendor-details/') +
              'admin/vendor-details/'.length
          )
          .split('/');
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
  }

  ngOnInit() {
    const routeArr = this.route.url
      .slice(
        this.route.url.indexOf('admin/vendor-details/') +
          'admin/vendor-details/'.length
      )
      .split('/');
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
  }
}
