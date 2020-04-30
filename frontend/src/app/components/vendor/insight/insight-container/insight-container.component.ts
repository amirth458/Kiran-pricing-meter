import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-container',
  templateUrl: './insight-container.component.html',
  styleUrls: ['./insight-container.component.css']
})
export class InsightContainerComponent implements OnInit {
  baseURL = '';
  sidemenuClosed: boolean;
  subMenus = [];
  selectedSubmenu;

  constructor(private router: Router) {
    this.baseURL = this.router.url.split('/')[1];
  }

  ngOnInit() {
    const menus = [
      'Customers',
      'Vendors',
      // 'New Users',
      'Facility',
      'RFQ',
      'Part',
      'Bid',
      'Order',
      'Process Profile',
      'Pricing Profile'
    ];

    this.subMenus = menus.map(item => ({
      name: item,
      route: `${this.baseURL}/${item.replace(/ /g, '-').toLowerCase()}`
    }));

    const routeNodes = this.router.url.split('/');
    this.selectedSubmenu = `${routeNodes[1]}/${routeNodes[2]}`;
  }
}
