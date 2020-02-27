import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders-container',
  templateUrl: './orders-container.component.html',
  styleUrls: ['./orders-container.component.css']
})
export class OrdersContainerComponent implements OnInit {
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
      name: 'Fullfillment Settings',
      tooltipMessage: 'Fullfillment Settings',
      route: 'fullfillment-settings',
      actions: [{ name: 'Save Settings', route: 'save-fullfillment-setting' }]
    },
    {
      name: 'Suborder Release Queue',
      tooltipMessage: 'Suborder Release Queue',
      route: 'suborder-release-queue',
      actions: []
    },
    {
      name: 'Order Confirmation Queue',
      tooltipMessage: 'Order Confirmation Queue',
      route: 'order-confirmation-queue',
      actions: []
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
      .slice(
        this.route.url.indexOf('pricing/orders/') + 'pricing/orders/'.length
      )
      .split('/');
    this.selectedTab = 'Fullfillment Settings';
    switch (routeArr[0]) {
      case 'fullfillment-settings':
        this.selectedTab = 'Fullfillment Settings';
        break;
      case 'suborder-release-queue':
        this.selectedTab = 'Suborder Release Queue';
        break;
      case 'order-confirmation-queue':
        this.selectedTab = 'Order Confirmation Queue';
        break;
      case 'released-orders':
        this.selectedTab = 'Released Orders';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/fullfillment-settings');
        break;
    }
  }
}
