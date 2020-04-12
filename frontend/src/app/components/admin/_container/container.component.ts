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
    if (this.routeArr[2]) {
      this.selectedSubmenu = this.baseURL + '/' + this.routeArr[2];
    } else {
      this.selectedSubmenu = this.baseURL + '/approve-vendor';
    }
  }

  ngOnDestroy() {}
}
