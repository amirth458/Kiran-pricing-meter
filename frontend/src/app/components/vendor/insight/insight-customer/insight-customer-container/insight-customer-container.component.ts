import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insight-customer-container',
  templateUrl: './insight-customer-container.component.html',
  styleUrls: ['./insight-customer-container.component.css']
})
export class InsightCustomerContainerComponent implements OnInit {
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
      name: 'Customers',
      tooltipMessage: 'Customers',
      route: 'customers',
      actions: []
    },
    {
      name: 'RFQ',
      tooltipMessage: 'RFQ',
      route: 'rfq',
      actions: []
    },
    {
      name: 'Part',
      tooltipMessage: 'Part',
      route: 'part',
      actions: []
    },
    {
      name: 'Order',
      tooltipMessage: 'Order',
      route: 'order',
      actions: []
    },
    {
      name: 'Suborder',
      tooltipMessage: 'Suborder',
      route: 'sub-order',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('insight/customer/') + 'insight/customer/'.length)
      .split('/');
    this.selectedTab = 'Customers';
    switch (routeArr[0]) {
      case 'customers':
        this.selectedTab = 'Customers';
        break;
      case 'rfq':
        this.selectedTab = 'RFQ';
        break;
      case 'part':
        this.selectedTab = 'Part';
        break;
      case 'order':
        this.selectedTab = 'Order';
      case 'sub-order':
        this.selectedTab = 'Suborder';
      default:
        this.route.navigateByUrl(this.route.url + '/customers');
        break;
    }
  }
}
