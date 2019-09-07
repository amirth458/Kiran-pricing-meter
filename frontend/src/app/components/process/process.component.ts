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
        actions: [{ name: 'Add Process Profile', route: 'add' }]
      },
      {
        name: 'Pricing',
        tooltipMessage: 'At vero eos et accusamus et',
        route: 'pricing',
        actions: [{ name: 'Add Pricing', route: 'add' }]
      }
    ];
  selectedTab = this.actionbarMenu[0].name;
  constructor() { }

  ngOnInit() {
  }

}
