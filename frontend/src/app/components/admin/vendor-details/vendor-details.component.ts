import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class AdminVendorDetailsComponent implements OnInit {
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
