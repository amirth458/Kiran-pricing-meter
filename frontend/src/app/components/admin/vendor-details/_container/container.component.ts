import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-vendor-details-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class AdminVendorDetailsContainerComponent implements OnInit {
  registerMenu = {
    name: 'User Details',
    tooltipMessage: 'User Details.',
    route: 'user',
    actions: ['back'],
  };
  vendorMenu = {
    name: 'Vendor Details',
    tooltipMessage: 'Vendor Details.',
    route: 'vendor',
    actions: ['back'],
  };
  machineMenu = {
    name: 'Machine Details',
    tooltipMessage: 'Machine Details.',
    route: 'machine',
    actions: ['back'],
  };
  actionbarMenu = [];
  selectedTab = 'User Details';

  constructor(private route: Router) {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const routeArr = this.route.url.slice(this.route.url.indexOf('admin/vendor-details/') + 'admin/vendor-details/'.length).split('/');
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
    const routeArr = this.route.url.slice(this.route.url.indexOf('admin/vendor-details/') + 'admin/vendor-details/'.length).split('/');
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
  }
}
