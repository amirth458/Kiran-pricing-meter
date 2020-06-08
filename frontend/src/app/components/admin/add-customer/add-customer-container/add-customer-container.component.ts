import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import * as tooltipData from '../../../../../assets/tooltip.json';

@Component({
  selector: 'app-add-customer-container',
  templateUrl: './add-customer-container.component.html',
  styleUrls: ['./add-customer-container.component.css']
})
export class AddCustomerContainerComponent implements OnInit {
  actionbarMenu = tooltipData.default.adminCustomer;
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {
    this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      const routeArr = this.route.url
        .slice(this.route.url.indexOf('user-manage/add-customer/') + 'user-manage/add-customer/'.length)
        .split('/');
      switch (routeArr[0]) {
        case 'user':
          this.selectedTab = 'User Details';
          break;
        case 'customer':
          this.selectedTab = 'Company Details';
          break;
        default:
          this.selectedTab = 'User Details';
          break;
      }
    });
  }

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('user-manage/add-customer/') + 'user-manage/add-customer/'.length)
      .split('/');
    switch (routeArr[0]) {
      case 'user':
        this.selectedTab = 'User Details';
        break;
      case 'customer':
        this.selectedTab = 'Company Details';
        break;
      default:
        this.selectedTab = 'User Details';
        break;
    }
  }
}
