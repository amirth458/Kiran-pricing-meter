import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-register-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class RegisterContainerComponent implements OnInit {
  registerMenu = {
    name: 'User Details',
    tooltipMessage: 'Register Users.',
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
  completed = false;

  constructor(private route: Router) {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const routeArr = this.route.url.slice(this.route.url.indexOf('signup/') + 'signup/'.length).split('/');
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
        case 'completed':
          this.completed = true;
          break;
        default:
          this.selectedTab = 'User Details';
          break;
      }
    });
  }

  ngOnInit() {
    const routeArr = this.route.url.slice(this.route.url.indexOf('unapproved/') + 'unapproved/'.length).split('/');
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
      case 'completed':
        this.completed = true;
        break;
      default:
        this.selectedTab = 'User Details';
        break;
    }

    this.actionbarMenu = [this.registerMenu, this.vendorMenu, this.machineMenu];
  }
}
