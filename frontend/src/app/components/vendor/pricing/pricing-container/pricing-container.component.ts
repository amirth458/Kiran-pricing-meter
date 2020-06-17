import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.css']
})
export class PricingContainerComponent implements OnInit {
  baseURL = '';
  sidemenuClosed: boolean;
  subMenus = [];
  selectedSubmenu = '';

  constructor(private route: Router) {
    this.baseURL = this.route.url.split('/')[1];
  }

  ngOnInit() {
    this.subMenus = [
      {
        name: 'RFQ',
        route: this.baseURL + '/rfq'
      },
      {
        name: 'ProdEX Order',
        route: this.baseURL + '/orders'
      }
    ];
    this.selectedSubmenu = this.baseURL + '/' + this.route.url.split('/')[2];
  }
}
