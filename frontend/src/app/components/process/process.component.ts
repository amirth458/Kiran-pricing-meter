import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css']
})
export class ProcessComponent implements OnInit {


  actionbarMenu: Array<{
    name: string,
    tooltipMessage: string,
    route: string,
    actions: Array<{ name: string, route: string }>
  }> = [
      {
        name: 'Profile',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'profile',
        actions: [
          { name: 'Add Process Profile', route: 'add' },
          { name: 'Profile Screener', route: 'profile-screener' }
        ]
      },
      {
        name: 'Pricing',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'pricing',
        actions: [
          { name: 'Add Pricing', route: 'add' },
          { name: 'Pricing Estimator', route: 'estimator' }
        ]
      }
    ];
  selectedTab = this.actionbarMenu[0].name;
  constructor(private route: Router) {
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const routeArr = this.route.url.slice(this.route.url.indexOf('/profile/processes/') + '/profile/processes/'.length).split('/');
      switch (routeArr[0]) {
        case 'profile':
          this.selectedTab = 'Profile';
          break;
        case 'pricing':
          this.selectedTab = 'Pricing';
          break;
      }
    });
   }

  ngOnInit() {
  }

}
