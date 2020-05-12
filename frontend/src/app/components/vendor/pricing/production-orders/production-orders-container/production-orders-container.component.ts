import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-production-orders-container',
  templateUrl: './production-orders-container.component.html',
  styleUrls: ['./production-orders-container.component.css']
})
export class ProductionOrdersContainerComponent implements OnInit {
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
      name: 'Pricing Settings',
      tooltipMessage: 'Pricing Settings',
      route: 'pricing-settings',
      actions: [{ name: 'Save Settings', route: 'save-production-setting' }]
    },
    {
      name: 'Released Orders',
      tooltipMessage: 'Released Orders',
      route: 'released-orders',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('pricing/production-orders/') + 'pricing/production-orders/'.length)
      .split('/');
    this.selectedTab = 'Pricing Settings';
    switch (routeArr[0]) {
      case 'pricing-settings':
        this.selectedTab = 'Pricing Settings';
        break;
      case 'released-orders':
        this.selectedTab = 'Released Orders';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/pricing-settings');
        break;
    }
  }
}
