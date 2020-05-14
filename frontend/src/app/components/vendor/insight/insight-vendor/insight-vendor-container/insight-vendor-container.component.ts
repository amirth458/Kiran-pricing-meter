import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insight-vendor-container',
  templateUrl: './insight-vendor-container.component.html',
  styleUrls: ['./insight-vendor-container.component.css']
})
export class InsightVendorContainerComponent implements OnInit {
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
      name: 'Vendors',
      tooltipMessage: 'Vendors',
      route: 'vendors',
      actions: []
    },
    {
      name: 'Facility',
      tooltipMessage: 'Facility',
      route: 'facility',
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
    },
    {
      name: 'Pricing Profile',
      tooltipMessage: 'Pricing Profile',
      route: 'pricing-profile',
      actions: []
    },
    {
      name: 'Process Profile',
      tooltipMessage: 'Process Profile',
      route: 'process-profile',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('insight/vendor/') + 'insight/vendor/'.length)
      .split('/');
    this.selectedTab = 'Vendors';
    switch (routeArr[0]) {
      case 'vendors':
        this.selectedTab = 'Vendors';
        break;
      case 'facility':
        this.selectedTab = 'Facility';
        break;
      case 'order':
        this.selectedTab = 'Order';
        break;
      case 'sub-order':
        this.selectedTab = 'Suborder';
        break;
      case 'pricing-profile':
        this.selectedTab = 'Pricing Profile';
        break;
      case 'process-profile':
        this.selectedTab = 'Process Profile';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/vendors');
        break;
    }
  }
}
