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

  constructor(private route: Router) {
    this.baseURL = this.route.url.split('/')[1];
  }

  ngOnInit() {
    this.subMenus = [
      {
        name: 'ProdEX Production',
        route: this.baseURL + '/projects'
      },
      {
        name: 'ProdEX Connect',
        route: this.baseURL + '/connect'
      }
    ];
    this.selectedSubmenu = this.baseURL + '/' + this.route.url.split('/')[2];
  }
}
