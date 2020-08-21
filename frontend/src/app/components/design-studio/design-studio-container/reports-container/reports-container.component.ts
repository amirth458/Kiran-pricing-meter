import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as tooltipData from '../../../../../assets/tooltip.json';

@Component({
  selector: 'app-reports-container',
  templateUrl: './reports-container.component.html',
  styleUrls: ['./reports-container.component.css']
})
export class ReportsContainerComponent implements OnInit {
  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = tooltipData.default.designStudio;
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('design-studio/reports/') + 'design-studio/reports/'.length)
      .split('/');
    switch (routeArr[0]) {
      case 'settings':
        this.selectedTab = 'Settings';
        break;
      case 'list':
        this.selectedTab = 'Reports';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/settings');
        this.selectedTab = 'Settings';
        break;
    }
  }
}
