import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as tooltipData from '../../../../../../assets/tooltip.json';

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
  }> = tooltipData.default.productionOrders;
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('pricing/production-orders/') + 'pricing/production-orders/'.length)
      .split('/');
    this.selectedTab = 'Released Orders';
    switch (routeArr[0]) {
      case 'released-orders':
        this.selectedTab = 'Released Orders';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/released-orders');
        break;
    }
  }
}
