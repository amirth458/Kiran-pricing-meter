import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rfq-container',
  templateUrl: './rfq-container.component.html',
  styleUrls: ['./rfq-container.component.css']
})
export class RfqContainerComponent implements OnInit {
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
      actions: [{ name: 'Save Settings', route: 'save-pricing-setting' }]
    },
    {
      name: 'Recent Auto Prices',
      tooltipMessage: 'Recent Auto Prices',
      route: 'auto-prices',
      actions: []
    },
    {
      name: 'Queued for Manual Price',
      tooltipMessage: 'Queueud for Manual Price',
      route: 'manual-price',
      actions: []
    }
  ];
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('pricing/rfq/') + 'pricing/rfq/'.length)
      .split('/');
    this.selectedTab = 'Pricing Settings';
    switch (routeArr[0]) {
      case 'pricing-settings':
        this.selectedTab = 'Pricing Settings';
        break;
      case 'auto-prices':
        this.selectedTab = 'Recent Auto Prices';
        break;
      case 'manual-price':
        this.selectedTab = 'Queued for Manual Price';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/pricing-settings');
        break;
    }
  }
}
