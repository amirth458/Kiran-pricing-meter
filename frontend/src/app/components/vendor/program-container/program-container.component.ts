import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-program-container',
  templateUrl: './program-container.component.html',
  styleUrls: ['./program-container.component.css']
})
export class ProgramContainerComponent implements OnInit {

  baseURL = '';

  submenus = [];
  selectedSubmenu;
  sidemenuClosed;

  vendor: Observable<any>;
  sub: Subscription;

  constructor(
    private route: Router,
  ) {
    this.baseURL = this.route.url.split('/')[1];
  }

  ngOnInit() {
    this.submenus = [
      {
        name: 'Overview',
        route: this.baseURL + '/overview'
      },
      {
        name: 'RFQ',
        route: this.baseURL + '/rfq'
      }, {
        name: 'Order',
        route: this.baseURL + '/order'
      }
    ];
    this.selectedSubmenu = this.baseURL + '/overview';
  }

}
