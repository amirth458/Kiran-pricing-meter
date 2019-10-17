import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
