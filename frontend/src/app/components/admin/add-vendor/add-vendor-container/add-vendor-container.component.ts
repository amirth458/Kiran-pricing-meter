import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { UserService } from 'src/app/service/user.service';
import * as tooltipData from '../../../../../assets/tooltip.json';

@Component({
  selector: 'app-add-vendor-container',
  templateUrl: './add-vendor-container.component.html',
  styleUrls: ['./add-vendor-container.component.css']
})
export class AddVendorContainerComponent implements OnInit {
  actionbarMenu = tooltipData.default.adminVendor;
  selectedTab = this.actionbarMenu[0].name;

  completed = false;
  constructor(private route: Router, public userService: UserService) {
    this.userService.setVendorRegistrationFormValidity('user', false);
    this.userService.setVendorRegistrationFormValidity('vendor', false);
    this.userService.setVendorRegistrationFormValidity('machine', false);
    this.clearLocalStorage();
    this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const routeArr = this.route.url
        .slice(this.route.url.indexOf('user-manage/add-vendor/') + 'user-manage/add-vendor/'.length)
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
      .slice(this.route.url.indexOf('user-manage/add-vendor/') + 'user-manage/add-vendor/'.length)
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

  clearLocalStorage() {
    this.userService.setVendorRegisterUserInfo(null);
    this.userService.setVendorRegisterVendorInfo(null);
    this.userService.setVendorRegisterMachineInfo(null);
  }

  ngOnDestroy() {
    this.clearLocalStorage();
  }
}
