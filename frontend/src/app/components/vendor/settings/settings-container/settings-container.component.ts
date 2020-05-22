import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as tooltipData from '../../../../../assets/tooltip.json';
@Component({
  selector: 'app-settings-container',
  templateUrl: './settings-container.component.html',
  styleUrls: ['./settings-container.component.css']
})
export class SettingsContainerComponent implements OnInit {
  baseURL = '';

  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = tooltipData.default.setting;
  selectedTab = this.actionbarMenu[0].name;

  constructor(public route: Router) {}

  ngOnInit() {
    const routeArr = this.route.url
      .slice(this.route.url.indexOf('setting/basic/') + 'setting/basic/'.length)
      .split('/');
    this.selectedTab = 'Password';
    switch (routeArr[0]) {
      case 'password':
        this.selectedTab = 'Password';
        break;
      case 'notification':
        this.selectedTab = 'Notification';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/password');
        break;
    }
  }
}
