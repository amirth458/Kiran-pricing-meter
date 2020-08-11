import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-studio-container',
  templateUrl: './design-studio-container.component.html',
  styleUrls: ['./design-studio-container.component.css']
})
export class DesignStudioContainerComponent implements OnInit {
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
        name: 'Reports',
        route: this.baseURL + '/reports'
      }
      // {
      //   name: 'Design',
      //   route: this.baseURL + '/design'
      // }
    ];
    this.selectedSubmenu = this.baseURL + '/' + this.route.url.split('/')[2];
  }
}
