import { ActionService } from './../../service/action.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { EventEmitterService } from 'src/app/components/event-emitter.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit, OnChanges {
  @Input('menus') menus: Array<{
    name: string;
    tooltipMessage: string;
    subtitle?: string;
    route: string;
    actions: Array<{ name: string; route: string }>;
  }>;
  @Input('selectedTab') selectedTab: string;
  baseURL;
  activeTabIndex = 0;

  modifiedItem = { index: null, value: [] };

  constructor(
    public route: Router,
    public activatedRoute: ActivatedRoute,
    public eventEmitterService: EventEmitterService,
    public actionService: ActionService,
    public location: Location
  ) {
    this.route.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        const routeArray = this.route.url.split('/');

        this.baseURL = `${routeArray[1]}/${routeArray[2]}`;
        if (routeArray.length > 2) {
          if (this.menus) {
            this.menus.map((x, index) => {
              if (x.route === routeArray[3]) {
                this.activeTabIndex = index;
                this.selectedTab = x.name;
              }
            });
          }
        }
      }
    });
  }

  ngOnInit() {}

  showBackBtn() {
    return (
      !this.route.url.includes('pricing-profile') &&
      (this.route.url.includes('referral/') ||
        this.route.url.includes('auto-prices/') ||
        this.route.url.includes('manual-price/') ||
        this.route.url.includes('billing/payment/details/') ||
        this.route.url.includes('user-manage/customers/view') ||
        this.route.url.startsWith('/projects/project-release-queue/') ||
        this.route.url.startsWith('/projects/vendor-confirmation-queue/') ||
        this.route.url.startsWith('/projects/released-projects/') ||
        this.route.url.startsWith('/pricing/production-orders/released-orders/') ||
        this.route.url.startsWith('/pricing/connect-orders/released-orders/') ||
        this.route.url.startsWith('/prodex/connect/release-queue/') ||
        this.route.url.startsWith('/prodex/connect/order-complete/') ||
        this.route.url.startsWith('/design-studio/reports/list/'))
    );
  }

  selectTab(tab) {
    const prevURL = this.route.url;
    this.route.navigateByUrl(`/${this.baseURL}/${tab.route}`).then(res => {
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
    if (route === 'save-pricing-setting') {
      this.actionService.triggerSaveProfileSetting();
    } else if (route === 'save-fullfillment-setting') {
      this.actionService.triggerSaveFullfillmentSetting();
    } else if (route === 'save-project-setting') {
      this.actionService.triggerSaveProductionSetting();
    } else if (route === 'save-connect-setting') {
      this.actionService.triggerSaveConnectSetting();
    } else if (route === 'save-report-setting') {
      this.actionService.triggerSaveReportSetting();
    } else {
      this.route.navigateByUrl(this.route.url + '/' + route);
    }
  }

  backButton() {
    const urlArray = this.route.url.split('/');
    if (urlArray[1] === 'marketplace') {
      this.route.navigateByUrl(`/${urlArray[1]}/${urlArray[2]}`);
    } else if (this.route.url.includes('/user-manage/customers/view/')) {
      this.route.navigateByUrl('/user-manage/customers');
    } else if (this.route.url.includes('/projects/')) {
      this.route.navigateByUrl(`/${urlArray[1]}/${urlArray[2]}`);
    } else if (urlArray.length > 6) {
      this.route.navigateByUrl(`/${urlArray[1]}/${urlArray[2]}/${urlArray[3]}/${urlArray[4]}`);
    } else if (
      this.route.url.includes('billing/payment/details/') ||
      this.route.url.includes('/design-studio/reports/list/')
    ) {
      this.location.back();
    } else {
      this.route.navigateByUrl(`/${urlArray[1]}/${urlArray[2]}/${urlArray[3]}`);
    }
  }

  getInfo() {
    if (this.route.url.startsWith('/design-studio/reports/list/')) {
      return `Report ${this.route.url.substr('/design-studio/reports/list/'.length)}`;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTab && changes.selectedTab.currentValue) {
      this.selectedTab = changes.selectedTab.currentValue;
      this.menus.map((x, index) => {
        if (x.name === this.selectedTab) {
          this.activeTabIndex = index;
        }
      });
    }
  }
}
