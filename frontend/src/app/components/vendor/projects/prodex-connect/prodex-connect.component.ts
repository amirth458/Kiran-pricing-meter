import { Component, OnInit } from '@angular/core';
import * as tooltipData from '../../../../../assets/tooltip.json';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prodex-connect',
  templateUrl: './prodex-connect.component.html',
  styleUrls: ['./prodex-connect.component.css']
})
export class ProdexConnectComponent implements OnInit {
  baseURL = '';

  actionbarMenu: Array<{
    name: string;
    tooltipMessage: string;
    route: string;
    actions: Array<{
      name: string;
      route: string;
    }>;
  }> = tooltipData.default.connect;

  selectedTab = this.actionbarMenu[0].name;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.baseURL = this.router.url.split('/')[1];
  }

  ngOnInit() {
    this.route.url.subscribe(v => {
      console.log(this.router.url);
      const routeArr = this.router.url.slice(this.router.url.indexOf('/connect/') + '/connect/'.length).split('/');

      switch (routeArr[0]) {
        case 'settings':
          this.selectedTab = 'Settings';
          break;
        case 'released-connect-projects':
          this.selectedTab = 'Released Projects';
          break;
        default:
          this.router.navigateByUrl(this.router.url + '/released-connect-projects');
          break;
      }
    });
  }
}
