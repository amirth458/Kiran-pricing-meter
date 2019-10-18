import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

declare var $: any;
@Component({
  selector: 'app-register-action-bar',
  templateUrl: './register-action-bar.component.html',
  styleUrls: ['./register-action-bar.component.css']
})
export class RegisterActionBarComponent implements OnChanges, OnInit {
  @ViewChild('infoModal') infoModal;
  @Input('menus') menus: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }>;
  @Input('selectedTab') selectedTab: string;
  baseURL = '';
  activeTabIndex = 0;
  constructor(private route: Router, private userService: UserService) { }

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
    const prevRoute = prevURL.split('/')[2];
    if (prevRoute === tab.route) {
      return;
    }
    if (prevRoute === 'user') {
      const valid = this.userService.getUserFormStatus();
      if (valid !== 1) {
        this.infoModal.nativeElement.click();
        return;
      }
    }

    if (prevRoute === 'vendor') {
      const valid = this.userService.getVendorFormStatus();
      if (valid !== 1) {
        this.infoModal.nativeElement.click();
        return;
      }
    }

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
}
