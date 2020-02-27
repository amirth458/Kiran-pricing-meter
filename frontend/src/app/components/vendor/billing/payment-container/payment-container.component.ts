import { Component, OnInit } from '@angular/core';

import * as tooltipData from '../../../../../assets/tooltip.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-container',
  templateUrl: './payment-container.component.html',
  styleUrls: ['./payment-container.component.css']
})
export class PaymentContainerComponent implements OnInit {
  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = tooltipData.default.payment;
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(
        this.route.url.indexOf('/billing/payment/') + '/billing/payment/'.length
      )
      .split('/');

    switch (routeArr[0]) {
      case 'waiting-for-approval':
        this.selectedTab = 'Waiting For Approval';
        break;
      case 'approved':
        this.selectedTab = 'Approved';
        break;
      case 'rejected':
        this.selectedTab = 'Rejected';
        break;
      case 'details':
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/waiting-for-approval');
        break;
    }
  }
}
