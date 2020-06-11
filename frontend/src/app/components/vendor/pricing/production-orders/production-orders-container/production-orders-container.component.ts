import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  pageType = 'production-orders';
  constructor(public router: Router, public route: ActivatedRoute) {
    this.route.params.subscribe(r => {
      if (r.projectType) {
        this.pageType = r.projectType;
      }
    });
  }

  ngOnInit() {
    const routeArr = this.router.url
      .slice(this.router.url.indexOf(`pricing/${this.pageType}/`) + `pricing/${this.pageType}/`.length)
      .split('/');
    this.selectedTab = 'Released Orders';
    switch (routeArr[0]) {
      case 'released-orders':
        this.selectedTab = 'Released Orders';
        break;
      default:
        this.router.navigateByUrl(this.router.url + '/released-orders');
        break;
    }
  }
}
