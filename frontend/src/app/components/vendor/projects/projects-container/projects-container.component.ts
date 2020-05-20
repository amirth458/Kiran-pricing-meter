import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  /*
    Add this to tooltip to show settings.
    {
      "name": "Settings",
      "tooltipMessage": "Settings",
      "route": "settings",
      "actions": [{ "name": "Save Settings", "route": "save-project-setting" }]
    },
    */
  selectedTab = this.actionbarMenu[0].name;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.baseURL = this.router.url.split('/')[1];
  }

  ngOnInit() {
    this.route.url.subscribe(v => {
      this.subMenus = [
        {
          name: 'Projects',
          route: this.baseURL
        }
      ];
      this.selectedSubmenu = this.baseURL;

      const routeArr = this.router.url.slice(this.router.url.indexOf('/projects/') + '/projects/'.length).split('/');

      switch (routeArr[0]) {
        case 'settings':
          this.selectedTab = 'Settings';
          break;
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
          this.router.navigateByUrl(this.router.url + '/project-release-queue');
          break;
      }
    });
  }
}
