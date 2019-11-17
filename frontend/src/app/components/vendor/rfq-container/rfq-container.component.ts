import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rfq-container',
  templateUrl: './rfq-container.component.html',
  styleUrls: ['./rfq-container.component.css']
})
export class RfqContainerComponent implements OnInit {
  actionbarMenu: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{
      name: string,
      route: string
    }>
  }> = [
      {
        name: 'Active RFQ',
        tooltipMessage: 'Active RFQ',
        route: 'active',
        actions: [{
          name: 'Create RFQ',
          route: 'add'
        }]
      },
      {
        name: 'Archived RFQ',
        tooltipMessage: 'Archived RFQ',
        route: 'archived',
        actions: [{
          name: 'Create RFQ',
          route: 'add'
        }]
      }];
  selectedTab = this.actionbarMenu[0].name;

  constructor(public route: Router) {
  }

  ngOnInit() {
    const routeArr = this.route.url.slice(this.route.url.indexOf('program/rfq/') + 'program/rfq/'.length).split('/');
    this.selectedTab = 'Active RFQ';
    switch (routeArr[0]) {
      case 'active':
        this.selectedTab = 'Active RFQ';
        break;
      case 'archived':
        this.selectedTab = 'Archived RFQ';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/active');
        break;
    }
  }
}
