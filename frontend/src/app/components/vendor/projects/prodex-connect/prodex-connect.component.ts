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
      const routeArr = this.router.url.slice(this.router.url.indexOf('/connect/') + '/connect/'.length).split('/');
      const pos = (this.actionbarMenu || []).findIndex(_ => _.route === routeArr[0]);
      if (pos !== -1) {
        this.selectedTab = this.actionbarMenu[pos].name;
      } else if (this.actionbarMenu.length) {
        this.router.navigateByUrl(this.router.url + this.actionbarMenu[0].route);
      }
    });
  }
}
