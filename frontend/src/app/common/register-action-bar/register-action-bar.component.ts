import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-register-action-bar',
  templateUrl: './register-action-bar.component.html',
  styleUrls: ['./register-action-bar.component.css']
})
export class RegisterActionBarComponent implements OnChanges, OnInit {
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
    this.baseURL = `${routeArray[1]}`;
    if (routeArray.length > 1) {
      this.menus.map((x, index) => {
        if (x.route === routeArray[2]) {
          this.activeTabIndex = index;
          this.selectedTab = x.name;
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const routeArray = this.route.url.split('/');
    if (routeArray.length > 1) {
      this.menus.map((x, index) => {
        if (x.route === routeArray[2]) {
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
    let gotoURL = '/profile/vendor/basics';
    const urlArray = this.route.url.split('/');
    gotoURL = `/${urlArray[1]}/${urlArray[2]}/${urlArray[3]}`;
    this.route.navigateByUrl(gotoURL);
  }

}