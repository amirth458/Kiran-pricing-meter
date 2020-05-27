import { Component, OnInit } from '@angular/core';
import * as tooltipData from '../../../../../assets/tooltip.json';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prodex-project',
  templateUrl: './prodex-project.component.html',
  styleUrls: ['./prodex-project.component.css']
})
export class ProdexProjectComponent implements OnInit {
  baseURL = '';

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

  constructor(private router: Router, private route: ActivatedRoute) {
    this.baseURL = this.router.url.split('/')[1];
  }

  ngOnInit() {
    this.route.url.subscribe(v => {
      console.log(this.router.url);
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
