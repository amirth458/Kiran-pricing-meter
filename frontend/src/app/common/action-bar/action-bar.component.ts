import { Component, OnInit, Input, ContentChild, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EventEmitterService } from 'src/app/components/event-emitter.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { ProfileScreenerService } from 'src/app/service/profile-screener.service';
import { SetRFQInfo, SetScreenedProfiles } from 'src/app/store/profile-screener-estimator/profile-screener-estimator.actions';

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
  isProfileScreener = false;
  activeMode = 'default';

  modifiedItem = { index: null, value: [] };

  screenerEstimatorStore$: Observable<any>;
  pageState = 'NULL';
  screenedProfiles = [];
  estimatedPrices = [];
  bestPrice = 0;

  constructor(
    public route: Router,
    public eventEmitterService: EventEmitterService,
    public store: Store<any>,
    public estimationAPI: ProfileScreenerService
  ) {
    this.screenerEstimatorStore$ = store.pipe(select('screenerEstimator'));

    // this.pageState = 'PENDING';

    // setTimeout(() => {
    this.screenerEstimatorStore$.subscribe(data => {
      this.pageState = data.status;
      this.screenedProfiles = data.screenedProfiles;
      this.estimatedPrices = data.estimatedPrices;

      this.estimatedPrices.map(item => {
        if (this.bestPrice < item.price) {
          this.bestPrice = item.price;
        }
      });
    });

    // }, 2000);

    route.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (this.route.url.includes('/profile-screener')) {
          this.isProfileScreener = true;
        } else {
          this.isProfileScreener = false;
        }
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

    if (route === 'profile-screener') {
      this.store.dispatch(new SetRFQInfo({}));
      this.store.dispatch(new SetScreenedProfiles([]));
    }
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

  navigateToPricingProfile() {
    const gotoURL = '/profile/processes/pricing';
    this.route.navigateByUrl(gotoURL);
  }

  startPriceEstimation() {
    const gotoURL = '/profile/processes/pricing/estimator/process';
    this.route.navigateByUrl(gotoURL);
  }

  saveAndStartPriceEstimation() {
    const gotoURL = '/profile/processes/pricing/estimator/process';
    this.eventEmitterService.onProcessScreen(gotoURL);
  }
  navigateToProfileScreener() {
    const gotoURL = '/profile/processes/profile/profile-screener';
    this.route.navigateByUrl(gotoURL);
  }

  startProfileScreening() {
    const gotoURL = '/profile/processes/profile/profile-screener/process';
    this.eventEmitterService.onProcessScreen(gotoURL);
  }

  isActionButton() {
    return this.menus[this.activeTabIndex].actions.length &&
      (!this.route.url.includes('add') &&
        !this.route.url.includes('edit') &&
        !this.route.url.includes('clone') &&
        !this.route.url.includes('profile-screener'));
  }

  isBackButton() {
    return this.menus[this.activeTabIndex].actions.length &&
      (this.route.url.includes('add') ||
        this.route.url.includes('edit') ||
        this.route.url.includes('clone'));
  }

  settingOnProfileScreener() {
    const gotoURL = '/profile/processes/profile/screener-setting';
    this.route.navigateByUrl(gotoURL);
  }
}
