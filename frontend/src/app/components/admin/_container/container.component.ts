import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class AdminContainerComponent implements OnInit, OnDestroy {
  baseURL = '';

  submenus = [];
  vendorMenus = [];
  additionalSubMenus = [];
  selectedSubmenu = '';
  sidemenuClosed;
  routeArr = [];

  constructor(private route: Router) {
    this.routeArr = this.route.url.split('/');
    this.baseURL = this.routeArr[1];
  }

  ngOnInit() {
    this.submenus = [
      {
        name: 'Vendors',
        route: this.baseURL + '/approve-vendor'
      },
      {
        name: 'Customers',
        route: this.baseURL + '/customers'
      }
    ];
    switch (this.routeArr[2]) {
      case 'customers':
      case 'add-customer':
        this.selectedSubmenu = this.baseURL + '/' + 'customers';
        break;
      default:
        this.selectedSubmenu = this.baseURL + '/' + 'approve-vendor';
        break;
    }
  }

  ngOnDestroy() {}
}
