import { Component, OnInit, Input, ContentChild, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EventEmitterService } from 'src/app/components/event-emitter.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

declare var $: any;
@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css']
})
export class ActionBarComponent implements OnInit {
  @Input('menus') menus: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }>;
  @Input('selectedTab') selectedTab: string;
  baseURL;
  activeTabIndex = 0;

  activeMode = 'default';

  modifiedItem = { index: null, value: [] };

  screenerEstimatorStore$: Observable<any>;
  pageState = 'NULL';
  screenedProfiles = [];
  constructor(
    public route: Router,
    public eventEmitterService: EventEmitterService,
    public store: Store<any>,
  ) {
    this.screenerEstimatorStore$ = store.pipe(select('screenerEstimator'));

    // this.pageState = 'PENDING';

    // setTimeout(() => {
    this.screenerEstimatorStore$.subscribe(data => {
      this.pageState = data.status;
      this.screenedProfiles = data.screenedProfiles;
    });

    // }, 2000);

    route.events.subscribe((val) => {
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

          if (routeArray.includes('profile-screener') && routeArray.includes('process')) {
            this.activeMode = 'profile-screener-process';
          } else {
            if (routeArray.includes('profile-screener')) {
              this.activeMode = 'profile-screener';
            } else {
              this.activeMode = 'default';
            }
          }


          if (routeArray.includes('pricing') && routeArray.includes('estimator') && routeArray.includes('process')) {
            this.activeMode = 'pricing-estimator-process';
            console.log('activated');

          } else if (routeArray.includes('pricing') && routeArray.includes('estimator')) {
            this.activeMode = 'pricing-estimator';
          }

        }
      }
    });
  }

  ngOnInit() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
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

  navigateToProfile() {
    const gotoURL = '/profile/processes/profile';
    this.route.navigateByUrl(gotoURL);
  }

  navigateToPricing() {
    const gotoURL = '/profile/processes/pricing/estimator';
    this.route.navigateByUrl(gotoURL);
  }

  navigateToPricingEstimator() {
    const gotoURL = '/profile/processes/pricing/estimator/process';
    this.route.navigateByUrl(gotoURL);
  }

  navigateToProfileScreener() {
    const gotoURL = '/profile/processes/profile/profile-screener';
    this.route.navigateByUrl(gotoURL);
  }

  startProfileScreening() {
    this.eventEmitterService.onProcessScreen();
  }
}
