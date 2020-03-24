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

  constructor(private route: Router) {
    this.baseURL = this.route.url.split('/')[1];
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

    this.selectedSubmenu = this.baseURL + '/approve-vendor';
  }

  ngOnDestroy() {}
}
