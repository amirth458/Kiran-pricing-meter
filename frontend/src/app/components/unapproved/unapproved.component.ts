import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unapproved',
  templateUrl: './unapproved.component.html',
  styleUrls: ['./unapproved.component.css']
})
export class UnapprovedComponent implements OnInit {
  registerMenu = {
    name: 'User Details',
    tooltipMessage: 'Register Users.',
    route: 'register',
  };
  vendorMenu = {
    name: 'Vendor Details',
    tooltipMessage: 'Vendor Details.',
    route: 'vendor-register',
  };
  machineMenu = {
    name: 'Machine Details',
    tooltipMessage: 'Machine Details.',
    route: 'machine-register',
  };
  actionbarMenu = [];
  selectedTab = 'User Details';

  constructor(private route: Router) {

  }

  ngOnInit() {
    const routeArr = this.route.url.slice(this.route.url.indexOf('unapproved/') + 'unapproved/'.length).split('/');
    switch (routeArr[0]) {
      case 'register':
        this.selectedTab = 'User Details';
        break;
      case 'vendor-register':
        this.selectedTab = 'Vendor Details';
        break;
      case 'machine-register':
        this.selectedTab = 'Machine Details';
        break;
      default:
        this.selectedTab = 'User Details';
        break;
    }

    this.actionbarMenu = [this.registerMenu, this.vendorMenu, this.machineMenu];
  }
}
