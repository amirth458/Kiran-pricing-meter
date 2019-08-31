import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {
  @Input('menus') menus: [{ name: string, route: string, actions: [] }];
  @Input('selectedTab') selectedTab: string;
  baseURL;
  activeTabIndex = 0;
  constructor(private route: Router) { }

  ngOnInit() {
    $(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip();
    });
    const routeArray = this.route.url.split('/');
    this.baseURL = routeArray[1];
    if (routeArray.length > 2) {
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
        } else {
          this.activeTabIndex = 0;
          this.selectedTab = this.menus[0].name;
        }
      });
  }


}
