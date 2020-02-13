import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing-container',
  templateUrl: './billing-container.component.html',
  styleUrls: ['./billing-container.component.css']
})
export class BillingContainerComponent implements OnInit {
  baseURL = "";
  sidemenuClosed: boolean;
  subMenus = [];
  selectedSubmenu = '';

  constructor(private route: Router) {
    this.baseURL = this.route.url.split("/")[1];
  }

  ngOnInit() {
    this.subMenus = [
      {
        name: 'Payment',
        route: this.baseURL + '/payment'
      }
    ];
    this.selectedSubmenu = this.baseURL + 'payment';
  }
}
