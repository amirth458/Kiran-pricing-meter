import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insight-admin-container',
  templateUrl: './insight-admin-container.component.html',
  styleUrls: ['./insight-admin-container.component.css']
})
export class InsightAdminContainerComponent implements OnInit {
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
      name: 'Quote',
      tooltipMessage: 'Quote',
      route: 'quote',
      actions: []
    },
    {
      name: 'Bid Order',
      tooltipMessage: 'Bid Order',
      route: 'bid-order',
      actions: []
    },
    {
      name: 'Bid Order Item',
      tooltipMessage: 'Bid Order Item',
      route: 'bid-order-item',
      actions: []
    },
    {
      name: 'Bid Process',
      tooltipMessage: 'Bid Process',
      route: 'bid-process',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('insight/admin/') + 'insight/admin/'.length)
      .split('/');
    this.selectedTab = 'Quote';
    switch (routeArr[0]) {
      case 'quote':
        this.selectedTab = 'Quote';
        break;
      case 'bid-order':
        this.selectedTab = 'Bid Order';
        break;
      case 'bid-order-item':
        this.selectedTab = 'Bid Order Item';
      case 'bid-process':
        this.selectedTab = 'Bid Process';
      default:
        this.route.navigateByUrl(this.route.url + '/quote');
        break;
    }
  }
}
