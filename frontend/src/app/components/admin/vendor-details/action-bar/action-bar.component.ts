import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-vendor-details-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class AdminVendorDetailsActionBarComponent implements OnChanges, OnInit {
  @Input('menus') menus: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }>;
  @Input('selectedTab') selectedTab: string;
  baseURL;
  activeTabIndex = 0;
  constructor(public route: Router) { }

  ngOnInit() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    const routeArray = this.route.url.split('/');

    this.baseURL = `${routeArray[1]}/${routeArray[2]}/${routeArray[3]}`;
    if (routeArray.length > 4) {
      this.menus.map((x, index) => {
        if (x.route === routeArray[4]) {
          this.activeTabIndex = index;
          this.selectedTab = x.name;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const routeArray = this.route.url.split('/');
    this.baseURL = `${routeArray[1]}/${routeArray[2]}/${routeArray[3]}`;
    if (routeArray.length > 4) {
      this.menus.map((x, index) => {
        if (x.route === routeArray[4]) {
          this.activeTabIndex = index;
          this.selectedTab = x.name;
        }
      });
    }
  }

  selectTab(tab) {
    const prevURL = this.route.url;
    this.route.navigateByUrl(`/${this.baseURL}/${tab.route}`)
      .then((res) => {
        if (this.route.url !== prevURL && this.route.url.includes(tab.route)) {
          this.selectedTab = tab.name;
          this.menus.map((x, index) => {
            if (x.name === tab.name) {
              this.activeTabIndex = index;
            }
          });
        }
      });
  }

  addButton(route) {
    this.route.navigateByUrl(this.route.url + '/' + route);
  }

  backButton() {
    this.route.navigateByUrl('/admin/approve');
  }

}
