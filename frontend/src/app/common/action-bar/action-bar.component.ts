import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnChanges, OnInit {
  @Input('menus') menus: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }>;
  @Input('selectedTab') selectedTab: string;
  baseURL;
  activeTabIndex = 0;
  isProfileScreener = false;
  modifiedItem = { index: null, value: [] };
  constructor(public route: Router) { }

  ngOnInit() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    const routeArray = this.route.url.split('/');
    this.baseURL = `${routeArray[1]}/${routeArray[2]}`;
    if (routeArray.length > 2) {
      this.menus.map((x, index) => {
        if (x.route === routeArray[3]) {
          this.activeTabIndex = index;
          this.selectedTab = x.name;
        }
      });
    }

    if (routeArray.includes('profile-screener')) {
      this.isProfileScreener = true;
      this.menus.map((menu, index) => {
        if (menu.name == this.selectedTab) {
          this.menus[index].actions = [{ name: 'Process', route: 'process' }]
        }
      });
    }

    this.route.events.subscribe(e => {

      if (e instanceof NavigationEnd) {
        if (e.url.includes('profile-screener')) {
          this.isProfileScreener = true;
          this.menus.map((menu, index) => {
            if (menu.name == this.selectedTab) {
              this.modifiedItem.index = index;
              this.modifiedItem.value = this.menus[index].actions;
              this.menus[index].actions = [{ name: 'Process', route: 'process' }]
            }
          });
        } else {
          this.isProfileScreener = false;
          if (this.modifiedItem.index !== null) {
            this.menus[this.modifiedItem.index].actions = this.modifiedItem.value;
          }
        }
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    const routeArray = this.route.url.split('/');
    this.baseURL = `${routeArray[1]}/${routeArray[2]}`;
    if (routeArray.length > 2) {
      this.menus.map((x, index) => {
        if (x.route === routeArray[3]) {
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
