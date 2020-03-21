import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as tooltipData from '../../../../../assets/tooltip.json';

@Component({
  selector: 'app-projects-container',
  templateUrl: './projects-container.component.html',
  styleUrls: ['./projects-container.component.css']
})
export class ProjectsContainerComponent implements OnInit {
  baseURL = '';
  sidemenuClosed: boolean;
  subMenus = [];
  selectedSubmenu = '';

  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = tooltipData.default.projects;
  selectedTab = this.actionbarMenu[0].name;

  constructor(private route: Router) {
    this.baseURL = this.route.url.split('/')[1];
  }

  ngOnInit() {
    this.subMenus = [
      {
        name: 'Projects',
        route: this.baseURL
      }
    ];
    this.selectedSubmenu = this.baseURL;

    const routeArr = this.route.url.slice(this.route.url.indexOf('/projects/') + '/projects/'.length).split('/');

    switch (routeArr[0]) {
      case 'project-release-queue':
        this.selectedTab = 'Project Release Queue';
        break;
      case 'vendor-confirmation-queue':
        this.selectedTab = 'Vendor Confirmation Queue';
        break;
      case 'released-projects':
        this.selectedTab = 'Released Projects';
        break;
      default:
        this.route.navigateByUrl(this.route.url + '/project-release-queue');
        break;
    }
  }
}
