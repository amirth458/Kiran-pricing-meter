import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

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
  selectedSubmenu = '';
  sidemenuClosed;


  constructor(
    private route: Router
  ) {
    this.baseURL = this.route.url.split('/')[1];
  }

  ngOnInit() {
    this.submenus = [
      {
        name: 'View Vendors',
        route: this.baseURL + '/approve-vendor'
      }
    ];

    this.selectedSubmenu = this.baseURL + '/approve-vendor';
  }

  ngOnDestroy() {

  }
}
