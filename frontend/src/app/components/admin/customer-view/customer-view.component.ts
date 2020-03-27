import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  baseURL = '';

  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = [
    {
      name: 'User Details',
      route: 'view/user',
      tooltipMessage: 'User Details',
      actions: []
    },
    {
      name: 'Contact',
      route: 'view/contact',
      tooltipMessage: 'Contact',
      actions: []
    },
    {
      name: 'Shipping',
      route: 'view/shipping',
      tooltipMessage: 'Shipping',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(public route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('customers/view/') + 'customers/view/'.length)
      .split('/');
    this.selectedTab = 'Company Details';
    switch (routeArr[0]) {
      case 'user':
        this.selectedTab = 'User Details';
        break;
      case 'contact':
        this.selectedTab = 'Contact';
        break;
      case 'shipping':
        this.selectedTab = 'Shipping';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/customers/view');
        break;
    }
  }
}
